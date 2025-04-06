import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
import pandas as pd
import threading
import os


class ScraperApp:
    def __init__(self, root):
        self.root = root
        self.df = None
        self.radaris_people_list = []
        self.intelius_people_list = []
        self.combined_people_list = []
        self.start_row = None
        self.end_row = None
        self.csv_name = ""

        # Configure root window
        self.root.configure(bg="#2E2E2E")  # Dark background
        self.root.title("Profile Scraper")
        self.root.minsize(800, 900)  # Set minimum window size

        self.show_main_screen()

    def show_main_screen(self):
        self.clear_window()
        label = tk.Label(self.root, text="Select a CSV file to process",
                        fg="white", bg="#2E2E2E",
                        font=("Helvetica", 24, "bold"))
        label.pack(pady=30)

        browse_button = tk.Button(self.root, text="Browse",
                                command=self.browse_file,
                                font=("Helvetica", 16),
                                bg="#4CAF50",  # Green
                                fg="white",
                                padx=30, pady=15,
                                width=20)
        browse_button.pack(pady=20)

        quit_button = tk.Button(self.root, text="Quit",
                              command=self.root.quit,
                              font=("Helvetica", 16),
                              bg="#f44336",  # Red
                              fg="white",
                              padx=30, pady=15,
                              width=20)
        quit_button.pack(pady=20)

    def show_collection_screen(self):
        self.clear_window()
        label = tk.Label(self.root, text="Select an action",
                        fg="white", bg="#2E2E2E",
                        font=("Helvetica", 24, "bold"))
        label.pack(pady=30)

        # Add an Entry widget to enter the start and end rows
        rows_label = tk.Label(self.root, text="Enter the range of rows to process:",
                            fg="white", bg="#2E2E2E",
                            font=("Helvetica", 16))
        rows_label.pack(pady=15)

        start_label = tk.Label(self.root, text="Start row:",
                             fg="white", bg="#2E2E2E",
                             font=("Helvetica", 14))
        start_label.pack(pady=5)
        start_entry = tk.Entry(self.root, font=("Helvetica", 14), width=10)
        start_entry.pack(pady=5)

        end_label = tk.Label(self.root, text="End row:",
                           fg="white", bg="#2E2E2E",
                           font=("Helvetica", 14))
        end_label.pack(pady=5)
        end_entry = tk.Entry(self.root, font=("Helvetica", 14), width=10)
        end_entry.pack(pady=5)

        def set_row_range():
            try:
                self.start_row = int(start_entry.get())
                self.end_row = int(end_entry.get())

                if self.start_row <= 0 or self.end_row <= 0:
                    raise ValueError("Row numbers must be positive integers.")
                if self.start_row > self.end_row:
                    raise ValueError("Start row cannot be greater than end row.")
                if self.start_row > len(self.df) or self.end_row > len(self.df):
                    raise ValueError(f"Row numbers cannot exceed the total number of rows ({len(self.df)}) in the CSV.")

            except ValueError as e:
                messagebox.showerror("Invalid Input", f"Please enter valid row numbers.\n{e}")
                return
            show_action_buttons()

        set_rows_button = tk.Button(self.root, text="Set Row Range",
                                  command=set_row_range,
                                  font=("Helvetica", 16),
                                  bg="#2196F3",  # Blue
                                  fg="white",
                                  padx=30, pady=15,
                                  width=20)
        set_rows_button.pack(pady=20)

        def show_action_buttons():
            # Clear any existing action buttons
            for widget in self.root.winfo_children():
                if isinstance(widget, tk.Button) and widget.cget("text") in ["Radaris Profile Collection", "Intelius Profile Collection", "Back", "Continue to Output"]:
                    widget.destroy()

            radaris_collect_button = tk.Button(self.root, text="Radaris Profile Collection",
                                             command=lambda: self.run_radaris_profile_collection(),
                                             font=("Helvetica", 16),
                                             bg="#4CAF50",  # Green
                                             fg="white",
                                             padx=30, pady=15,
                                             width=25)
            radaris_collect_button.pack(pady=15)

            intelius_collect_button = tk.Button(self.root, text="Intelius Profile Collection",
                                              command=lambda: self.run_intelius_profile_collection(),
                                              font=("Helvetica", 16),
                                              bg="#4CAF50",  # Green
                                              fg="white",
                                              padx=30, pady=15,
                                              width=25)
            intelius_collect_button.pack(pady=15)

            button_frame = tk.Frame(self.root, bg="#2E2E2E")
            button_frame.pack(pady=20)

            back_button = tk.Button(button_frame, text="Back",
                                  command=self.show_main_screen,
                                  font=("Helvetica", 16),
                                  bg="#2196F3",  # Blue
                                  fg="white",
                                  padx=30, pady=15,
                                  width=15)
            back_button.pack(side="left", padx=10)

            continue_button = tk.Button(button_frame, text="Continue to Output",
                                      command=lambda: self.set_output_buttons(),
                                      font=("Helvetica", 16),
                                      bg="#2196F3",  # Blue
                                      fg="white",
                                      padx=30, pady=15,
                                      width=15)
            continue_button.pack(side="left", padx=10)

    def show_output_screen(self):
        self.clear_window()
        label = tk.Label(self.root, text="Output Settings",
                        fg="white", bg="#2E2E2E",
                        font=("Helvetica", 24, "bold"))
        label.pack(pady=30)

        # Show number of profiles collected
        if self.combined_people_list:
            profile_count = len(self.combined_people_list)
            count_label = tk.Label(self.root, text=f"Profiles collected: {profile_count}",
                                 fg="white", bg="#2E2E2E",
                                 font=("Helvetica", 16))
            count_label.pack(pady=10)

        csv_label = tk.Label(self.root, text="Enter the name or browse for the output CSV file:",
                           fg="white", bg="#2E2E2E",
                           font=("Helvetica", 16))
        csv_label.pack(pady=10)

        # Create a frame for the CSV name input and preview
        csv_frame = tk.Frame(self.root, bg="#2E2E2E")
        csv_frame.pack(pady=10)

        csv_entry = tk.Entry(csv_frame, font=("Helvetica", 14), width=30)
        csv_entry.pack(side=tk.LEFT, padx=5)

        preview_label = tk.Label(csv_frame, text=".csv",
                               fg="white", bg="#2E2E2E",
                               font=("Helvetica", 14))
        preview_label.pack(side=tk.LEFT, padx=5)

        def browse_for_csv():
            self.csv_name = filedialog.askopenfilename(filetypes=[("CSV files", "*.csv")])
            if self.csv_name:
                messagebox.showinfo("Success", f"Output file will be saved as: {self.csv_name}")
                self.show_collection_screen()
            else:
                messagebox.showerror("Error", "No CSV file selected!")

        # Button to browse for an existing CSV file
        browse_button = tk.Button(self.root, text="Browse for CSV",
                                command=browse_for_csv,
                                font=("Helvetica", 16),
                                bg="#2196F3",  # Blue
                                fg="white",
                                padx=30, pady=15,
                                width=20)
        browse_button.pack(pady=15)

        def update_preview(*args):
            text = csv_entry.get().strip()
            if text and not text.endswith('.csv'):
                preview_label.config(text=".csv")
            else:
                preview_label.config(text="")

        csv_entry.bind('<KeyRelease>', update_preview)

        def set_csv_name():
            try:
                csv_entry_text = csv_entry.get().strip()
                if not csv_entry_text:
                    raise ValueError("CSV name cannot be empty")
                if not csv_entry_text.endswith(".csv"):
                    self.csv_name = csv_entry_text + ".csv"
                else:
                    self.csv_name = csv_entry_text

                messagebox.showinfo("Success", f"Output file will be saved as: {self.csv_name}")
                self.show_collection_screen()
            except ValueError as e:
                messagebox.showerror("Invalid Input", f"Please enter valid name.\n{e}")

        set_csv_button = tk.Button(self.root, text="Set CSV Name",
                                 command=set_csv_name,
                                 font=("Helvetica", 16),
                                 bg="#4CAF50",  # Green
                                 fg="white",
                                 padx=30, pady=15,
                                 width=20)
        set_csv_button.pack(pady=15)

    def browse_file(self):
        """Opens a file dialog and reads the selected CSV file."""
        file_path = filedialog.askopenfilename(filetypes=[("CSV files", "*.csv")])
        if file_path:
            self.read_file(file_path)

    def read_file(self, file_path):
        """Reads file type and returns values in a pandas df."""
        try:
            self.df = pd.read_csv(file_path)
            messagebox.showinfo("CSV Loaded", f"CSV file successfully loaded! {self.df.shape[0]} rows found.")
            self.show_output_screen()  # Move to the collection screen after loading
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load CSV: {e}")

    def run_radaris_profile_collection(self):
        """Runs the profile collection function with the loaded dataframe."""

        if self.df is None:
            messagebox.showerror("Error", "No CSV file loaded!")
            return

        # Create a copy of the dataframe for processing
        processing_df = self.df.copy()

        # Limit the rows to process based on the selected range
        if self.start_row is not None and self.end_row is not None:
            if self.start_row <= len(processing_df) and self.end_row <= len(processing_df):
                processing_df = processing_df.iloc[self.start_row - 1:self.end_row].reset_index(drop=True)
            else:
                messagebox.showerror("Invalid Range", "The row range exceeds the available rows in the CSV.")
                return

        # Create progress bar and display it
        progress_bar = ttk.Progressbar(self.root, orient="horizontal", length=350, mode="determinate", maximum=100)
        progress_bar.pack(pady=20)

        # Create and display loading label
        loading_label = tk.Label(self.root, text="Processing...", fg="white", bg="#2E2E2E", font=("Helvetica", 12))
        loading_label.pack(pady=5)

        # Create and display status label
        status_label = tk.Label(self.root, text="", fg="white", bg="#2E2E2E", font=("Helvetica", 10))
        status_label.pack(pady=5)

        self.root.after(0, self.root.update_idletasks)  # Ensure the progress bar is rendered

        def update_progress(i, status_text=None):
            progress_bar['value'] = i
            if status_text:
                status_label.config(text=status_text)
            self.root.after(0, self.root.update_idletasks)  # Refresh the GUI to show updated progress
            return True

        # Function to handle profile collection
        def task():
            try:
                self.radaris_people_list = radaris_profile_collection(processing_df, progress_callback=update_progress)
                self.root.after(0, lambda: messagebox.showinfo("Success", "Radaris Profile Collection Completed!"))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Error", f"Radaris Profile collection failed: {e}"))
            finally:
                self.root.after(0, lambda: progress_bar.pack_forget())  # Hide the progress bar after completion
                self.root.after(0, lambda: loading_label.pack_forget())  # Hide the loading label
                self.root.after(0, lambda: status_label.pack_forget())  # Hide the status label

        # Run the task in a separate thread to keep the GUI responsive
        threading.Thread(target=task, daemon=True).start()

    def run_intelius_profile_collection(self):
        """Runs the profile collection function with the loaded dataframe."""

        if self.df is None:
            messagebox.showerror("Error", "No CSV file loaded!")
            return

        # Create a copy of the dataframe for processing
        processing_df = self.df.copy()

        # Limit the rows to process based on the selected range
        if self.start_row is not None and self.end_row is not None:
            if self.start_row <= len(processing_df) and self.end_row <= len(processing_df):
                processing_df = processing_df.iloc[self.start_row - 1:self.end_row].reset_index(drop=True)
            else:
                messagebox.showerror("Invalid Range", "The row range exceeds the available rows in the CSV.")
                return

        # Create progress bar and display it
        progress_bar = ttk.Progressbar(self.root, orient="horizontal", length=350, mode="determinate", maximum=100)
        progress_bar.pack(pady=20)

        # Create and display loading label
        loading_label = tk.Label(self.root, text="Processing...", fg="white", bg="#2E2E2E", font=("Helvetica", 12))
        loading_label.pack(pady=5)

        # Create and display status label
        status_label = tk.Label(self.root, text="", fg="white", bg="#2E2E2E", font=("Helvetica", 10))
        status_label.pack(pady=5)

        self.root.after(0, self.root.update_idletasks)  # Ensure the progress bar is rendered

        def update_progress(i, status_text=None):
            progress_bar['value'] = i
            if status_text:
                status_label.config(text=status_text)
            self.root.after(0, self.root.update_idletasks)  # Refresh the GUI to show updated progress
            return True

        # Function to handle profile collection
        def task():
            try:
                self.intelius_people_list = intelius_profile_collection(processing_df, progress_callback=update_progress)
                self.root.after(0, lambda: messagebox.showinfo("Success", "Intelius Profile Collection Completed!"))
            except Exception as e:
                self.root.after(0, lambda: messagebox.showerror("Error", f"Intelius Profile collection failed: {e}"))
            finally:
                self.root.after(0, lambda: progress_bar.pack_forget())  # Hide the progress bar after completion
                self.root.after(0, lambda: loading_label.pack_forget())  # Hide the loading label
                self.root.after(0, lambda: status_label.pack_forget())  # Hide the status label

        # Run the task in a separate thread to keep the GUI responsive
        threading.Thread(target=task, daemon=True).start()

    def output_to_csv(self):
        if not self.radaris_people_list and not self.intelius_people_list:
            messagebox.showerror("Error", "No profiles to export!")
            return

        if not self.csv_name:
            messagebox.showerror("Error", "Please set a CSV name first!")
            return

        # Check if the file exists and ask whether to overwrite or append
        if os.path.exists(self.csv_name):
            append_choice = messagebox.askyesno("File Exists",
                                                f"The file {self.csv_name} already exists. Do you want to append?")
            if not append_choice:
                messagebox.showinfo("Cancelled", "File appending cancelled.")
                return

        # Create progress bar and display it
        progress_bar = ttk.Progressbar(self.root, orient="horizontal", length=350, mode="determinate", maximum=100)
        progress_bar.pack(pady=20)

        # Create and display loading label
        loading_label = tk.Label(self.root, text="Saving to CSV...", fg="white", bg="#2E2E2E", font=("Helvetica", 12))
        loading_label.pack(pady=5)

        self.root.after(0, self.root.update_idletasks)  # Ensure the progress bar is rendered

        def update_progress(i, status_text=None):
            progress_bar['value'] = i
            if status_text:
                loading_label.config(text=status_text)
            self.root.after(0, self.root.update_idletasks)  # Refresh the GUI to show updated progress
            return True

        try:
            def task():
                # Combine profiles from both scrapers
                max_length = max(len(self.radaris_people_list), len(self.intelius_people_list))

                for i in range(max_length):
                    radaris_entry = self.radaris_people_list[i] if i < len(self.radaris_people_list) else {"name": "", "radaris_age": "", "location": "", "radaris_profile_links": []}
                    intelius_entry = self.intelius_people_list[i] if i < len(self.intelius_people_list) else {"name": "", "intelius_age": "", "location": "", "intelius_profile_links": []}

                    self.combined_people_list.append({
                        "name": radaris_entry["name"],  # Name & location are the same in both lists
                        "radaris_age": radaris_entry["radaris_age"],
                        "intelius_age": intelius_entry["intelius_age"],
                        "location": radaris_entry["location"],
                        "radaris_profile_links": radaris_entry.get("radaris_profile_links", []),
                        "intelius_profile_links": intelius_entry.get("intelius_profile_links", [])
                    })

                try:
                    write_profiles_to_csv(self.combined_people_list, self.csv_name, progress_callback=update_progress)
                    self.root.after(0, lambda: messagebox.showinfo("Success",
                                                              f"Profiles have been successfully written to {self.csv_name}!"))
                except Exception as e:
                    self.root.after(0, lambda: messagebox.showerror("Error", f"Failed to write profiles to CSV: {e}"))
                finally:
                    self.root.after(0, lambda: progress_bar.pack_forget())  # Hide the progress bar after completion
                    self.root.after(0, lambda: loading_label.pack_forget())  # Hide the loading label

            # Run the task in a separate thread to keep the GUI responsive
            threading.Thread(target=task, daemon=True).start()

        except Exception as e:
            messagebox.showerror("Error", f"Failed to start CSV export: {e}")
            self.root.after(0, lambda: progress_bar.pack_forget())  # Hide the progress bar after an error
            self.root.after(0, lambda: loading_label.pack_forget())  # Hide the loading label

    def set_output_buttons(self):
        self.clear_window()

        label = tk.Label(self.root, text="Final Output",
                        fg="white", bg="#2E2E2E",
                        font=("Helvetica", 24, "bold"))
        label.pack(pady=30)

        collect_button = tk.Button(self.root, text="Output to CSV",
                                 command=lambda: self.output_to_csv(),
                                 font=("Helvetica", 16),
                                 bg="#4CAF50",  # Green
                                 fg="white",
                                 padx=30, pady=15,
                                 width=20)
        collect_button.pack(pady=20)

        back_button = tk.Button(self.root, text="Back",
                              command=self.show_collection_screen,
                              font=("Helvetica", 16),
                              bg="#2196F3",  # Blue
                              fg="white",
                              padx=30, pady=15,
                              width=20)
        back_button.pack(pady=20)

        quit_button = tk.Button(self.root, text="Quit",
                              command=self.root.quit,
                              font=("Helvetica", 16),
                              bg="#f44336",  # Red
                              fg="white",
                              padx=30, pady=15,
                              width=20)
        quit_button.pack(pady=20)

    def clear_window(self):
        """Removes all widgets from the root window to switch views."""
        for widget in self.root.winfo_children():
            widget.destroy()