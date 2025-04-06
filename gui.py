import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
import pandas as pd
import threading
import os
import random
import sys

class CookiedleApp:
    def __init__(self, root):
        self.root = root
        # Load the CSV data at startup
        try:
            self.df = pd.read_csv('cookies_rows(1).csv')
            # Select a random cookie as the target
            self.selected_cookie = self.df.iloc[random.randint(0, len(self.df)-1)]
            print(f"Debug - Selected cookie: {self.selected_cookie['cookie_name']}")  # For testing
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load cookie data: {e}")
            self.quit_app()
            return

        self.guesses = 0
        self.guess_history = []

        # Configure root window
        self.root.configure(bg="#2E2E2E")  # Dark background
        self.root.title("Cookiedle")
        self.root.geometry("1000x1000")
        self.root.minsize(1000, 1000)

        # Set up proper window closing protocol
        self.root.protocol("WM_DELETE_WINDOW", self.quit_app)

        self.show_main_screen()

    def quit_app(self):
        """Properly handle application quit"""
        try:
            # Destroy the root window directly
            self.root.destroy()
        except Exception as e:
            print(f"Error during quit: {e}")
        finally:
            sys.exit(0)

    def show_main_screen(self):
        self.clear_window()
        
        # Title label
        label = tk.Label(self.root, text="Welcome to Cookiedle Rayndeer!",
                        fg="white", bg="#2E2E2E",
                        font=("Helvetica", 24, "bold"))
        label.pack(pady=30)

        # Start game button
        start_button = tk.Button(self.root, text="Start Game",
                               command=self.show_game_screen,
                               font=("Helvetica", 16),
                               bg="#4CAF50",  # Green
                               fg="white",
                               padx=30, pady=15,
                               width=20)
        start_button.pack(pady=20)

        # Quit button
        quit_button = tk.Button(self.root, text="Quit",
                              command=self.quit_app,
                              font=("Helvetica", 16),
                              bg="#f44336",  # Red
                              fg="white",
                              padx=30, pady=15,
                              width=20)
        quit_button.pack(pady=20)

    def show_game_screen(self):
        self.clear_window()
        
        # Game title
        label = tk.Label(self.root, text="Guess the Cookie!",
                        fg="white", bg="#2E2E2E",
                        font=("Helvetica", 24, "bold"))
        label.pack(pady=20)

        # Create frame for guess history with a canvas and scrollbar
        canvas_frame = tk.Frame(self.root, bg="#2E2E2E")
        canvas_frame.pack(pady=20, fill=tk.BOTH, expand=True)

        canvas = tk.Canvas(canvas_frame, bg="#2E2E2E", highlightthickness=0)
        scrollbar = ttk.Scrollbar(canvas_frame, orient="vertical", command=canvas.yview)
        history_frame = tk.Frame(canvas, bg="#2E2E2E")

        canvas.configure(yscrollcommand=scrollbar.set)

        scrollbar.pack(side="right", fill="y")
        canvas.pack(side="left", fill="both", expand=True)
        canvas.create_window((0, 0), window=history_frame, anchor="nw")

        # Headers for traits
        header_frame = tk.Frame(history_frame, bg="#2E2E2E")
        header_frame.pack(fill="x", padx=10)

        headers = ["Cookie Name", "Primary Color", "Secondary Color", "Rarity", "Type", "Position"]
        header_widths = [25, 15, 15, 15, 15, 15]
        for header, width in zip(headers, header_widths):
            header_label = tk.Label(header_frame, 
                                  text=header,
                                  fg="white",
                                  bg="#2E2E2E",
                                  font=("Helvetica", 10, "bold", "underline"),
                                  width=width,
                                  anchor="center")  # Center the text
            header_label.pack(side=tk.LEFT, padx=2, fill="x")

        # Create guess entry frame
        guess_frame = tk.Frame(self.root, bg="#2E2E2E")
        guess_frame.pack(pady=20)

        # Create a frame for the entry and suggestion listbox
        entry_container = tk.Frame(guess_frame, bg="#2E2E2E")
        entry_container.pack(side=tk.LEFT, padx=5)

        # Guess entry
        guess_entry = tk.Entry(entry_container, font=("Helvetica", 14), width=30)
        guess_entry.pack()

        # Create suggestion listbox with matching width
        # Calculate width in characters based on entry width
        entry_width_pixels = guess_entry.winfo_reqwidth()  # Get entry width in pixels
        char_width = entry_width_pixels // 14  # Approximate character width for Helvetica 12

        suggestion_list = tk.Listbox(entry_container,
                                   font=("Helvetica", 12),
                                   width=char_width,  # Match entry width
                                   bg="white",
                                   fg="black",
                                   selectmode=tk.SINGLE,
                                   selectbackground="#4CAF50",
                                   selectforeground="white",
                                   height=5)
        suggestion_list.pack_forget()  # Initially hidden

        def update_suggestions(event=None):
            # Add a small delay to ensure we get the latest entry content
            self.root.after(10, lambda: update_suggestions_delayed())

        def update_suggestions_delayed():
            current_text = guess_entry.get().lower()
            suggestion_list.delete(0, tk.END)  # Clear current suggestions
            
            if current_text:
                # Find matching cookies that start with the current text
                matches = self.df[self.df['cookie_name'].str.lower().str.startswith(current_text)]['cookie_name'].tolist()
                
                if matches:
                    suggestion_list.pack()  # Show suggestion list
                    for cookie in matches[:5]:  # Show 5 suggestions
                        suggestion_list.insert(tk.END, cookie)
                else:
                    # If no matches found with startswith, try contains
                    matches = self.df[self.df['cookie_name'].str.lower().str.contains(current_text)]['cookie_name'].tolist()
                    if matches:
                        suggestion_list.pack()
                        for cookie in matches[:5]: # Show 5 suggestions
                            suggestion_list.insert(tk.END, cookie)
                    else:
                        suggestion_list.pack_forget()  # Hide if no matches
            else:
                suggestion_list.pack_forget()  # Hide if entry is empty

        def use_suggestion(event=None):
            if suggestion_list.curselection():
                selected = suggestion_list.get(suggestion_list.curselection())
                guess_entry.delete(0, tk.END)
                guess_entry.insert(0, selected)
                suggestion_list.pack_forget()
                guess_entry.focus()

        def handle_entry_click(event=None):
            if guess_entry.get():
                suggestion_list.pack()
                update_suggestions()

        # Bind events
        guess_entry.bind('<KeyRelease>', update_suggestions)
        guess_entry.bind('<Key>', update_suggestions)  # Add binding for key press
        guess_entry.bind('<Button-1>', handle_entry_click)
        suggestion_list.bind('<Double-Button-1>', use_suggestion)
        suggestion_list.bind('<Return>', use_suggestion)

        def make_guess(event=None):
            try:
                guess = guess_entry.get().strip()
                if guess:
                    # Find the guessed cookie in the dataframe
                    guessed_cookie = self.df[self.df['cookie_name'].str.lower() == guess.lower()]
                    if not guessed_cookie.empty:
                        suggestion_list.pack_forget()  # Hide suggestions after successful guess
                        self.guesses += 1
                        self.guess_history.append(guess)
                        
                        # Update history and scroll
                        self.update_history(history_frame)
                        guess_entry.delete(0, tk.END)
                        
                        if history_frame.winfo_exists():
                            history_frame.update_idletasks()
                            canvas.configure(scrollregion=canvas.bbox("all"))
                            canvas.yview_moveto(1)
                    else:
                        messagebox.showerror("Error", f"Cookie '{guess}' not found in database!")
            except Exception as e:
                print(f"Error in make_guess: {e}")

        # Bind Enter key to make_guess function
        guess_entry.bind('<Return>', make_guess)

        # Submit button
        submit_button = tk.Button(guess_frame, text="Submit",
                                command=make_guess,
                                font=("Helvetica", 14),
                                bg="#4CAF50",
                                fg="white")
        submit_button.pack(side=tk.LEFT, padx=5)

        # Back button
        back_button = tk.Button(self.root, text="Back to Main",
                              command=self.show_main_screen,
                              font=("Helvetica", 16),
                              bg="#2196F3",
                              fg="white",
                              width=15)
        back_button.pack(pady=20)

        # Set focus to the entry field
        guess_entry.focus()

    def update_history(self, history_frame):
        # Clear existing history
        for widget in history_frame.winfo_children():
            # Skip the header frame (first child)
            if widget != history_frame.winfo_children()[0]:
                widget.destroy()

        # Get the latest guess (the one we need to animate)
        latest_guess = self.guess_history[-1]
        
        # Add previous guesses instantly (no animation)
        for guess_name in self.guess_history[:-1]:
            self.add_guess_row(history_frame, guess_name, animate=False)
            
        # Add the latest guess with animation
        self.add_guess_row(history_frame, latest_guess, animate=True)
        
        # Update the scrollregion after adding new labels
        history_frame.update_idletasks()

    def add_guess_row(self, history_frame, guess_name, animate=False):
        # Create frame for the guess content
        guess_frame = tk.Frame(history_frame, bg="#2E2E2E")
        guess_frame.pack(fill="x", padx=10, pady=2)

        # Get the guessed cookie's attributes from the dataframe
        guessed_cookie = self.df[self.df['cookie_name'].str.lower() == guess_name.lower()].iloc[0]
        
        # Compare each trait with the selected cookie
        traits = [
            {"value": guessed_cookie['cookie_name'], 
             "correct": guessed_cookie['cookie_name'].lower() == self.selected_cookie['cookie_name'].lower()},
            {"value": guessed_cookie['primary_color'],
             "correct": guessed_cookie['primary_color'].lower() == self.selected_cookie['primary_color'].lower(),
             "partial": guessed_cookie['primary_color'].lower() == self.selected_cookie['secondary_color'].lower()},
            {"value": guessed_cookie['secondary_color'],
             "correct": guessed_cookie['secondary_color'].lower() == self.selected_cookie['secondary_color'].lower(),
             "partial": guessed_cookie['secondary_color'].lower() == self.selected_cookie['primary_color'].lower()},
            {"value": guessed_cookie['rarity'], 
             "correct": guessed_cookie['rarity'].lower() == self.selected_cookie['rarity'].lower()},
            {"value": guessed_cookie['type'], 
             "correct": guessed_cookie['type'].lower() == self.selected_cookie['type'].lower()},
            {"value": guessed_cookie['position'], 
             "correct": guessed_cookie['position'].lower() == self.selected_cookie['position'].lower()}
        ]

        border_frames = []
        labels = []
        for index, trait in enumerate(traits):
            # Default to red (wrong)
            bg_color = "#f44336"
            
            # If it's a color trait (has 'partial' key)
            if 'partial' in trait:
                if trait["correct"]:
                    bg_color = "#4CAF50"  # Green for correct
                elif trait["partial"]:
                    bg_color = "#FFA500"  # Orange/Yellow for color in wrong position
            # For non-color traits
            elif trait["correct"]:
                bg_color = "#4CAF50"  # Green for correct

            # Determine width based on trait index
            width = 25 if index == 0 else 15  # First trait (cookie name) gets wider label
            
            # Create a frame with black border for each trait
            trait_border_frame = tk.Frame(guess_frame, bg="black", padx=1, pady=1)  # Black border
            if not animate:
                trait_border_frame.pack(side=tk.LEFT, padx=2)
            border_frames.append(trait_border_frame)

            # Create the label inside the border frame
            label = tk.Label(trait_border_frame, 
                           text=trait["value"],
                           fg="white",
                           bg=bg_color,
                           font=("Helvetica", 10),
                           width=width,
                           wraplength=200 if index == 0 else 100,  # Allow wrapping for long names
                           padx=2,
                           pady=5)
            label.pack(fill="both", expand=True)
            labels.append((trait_border_frame, label))

        if animate:
            def show_next_label(index=0):
                if index < len(labels):
                    border_frame, _ = labels[index]
                    border_frame.pack(side=tk.LEFT, padx=2)
                    self.root.after(700, lambda: show_next_label(index + 1))
                elif guess_name.lower() == self.selected_cookie['cookie_name'].lower():
                    # Show victory message only after animation completes
                    self.root.after(200, self.show_victory_message)
            
            show_next_label()

    def show_victory_message(self):
        """Show victory message and reset game"""
        messagebox.showinfo("Congratulations!", 
                          f"You've found the cookie in {self.guesses} guesses!\n"
                          f"The cookie was: {self.selected_cookie['cookie_name']}")
        
        # Reset game state
        self.guesses = 0
        self.guess_history = []
        self.selected_cookie = self.df.iloc[random.randint(0, len(self.df)-1)]
        
        # Return to main screen
        self.show_main_screen()

    def clear_window(self):
        """Removes all widgets from the root window to switch views."""
        try:
            for widget in self.root.winfo_children():
                widget.destroy()
        except Exception as e:
            print(f"Error during clear_window: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = CookiedleApp(root)
    root.mainloop()