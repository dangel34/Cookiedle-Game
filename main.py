from gui import CookiedleApp
import tkinter as tk

# Create the main application window
root = tk.Tk()

# Show the main screen
app = CookiedleApp(root)
app.show_main_screen()

# Run the Tkinter event loop
root.mainloop()