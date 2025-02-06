import tkinter as tk
from tkinter import messagebox

window = tk.Tk()
window.title("Cookie Guessing Game")

guess_label = tk.Label(window, text="Enter your guess (cookie name):")
guess_label.pack()

guess_entry = tk.Entry(window)
guess_entry.pack()

guess_button = tk.Button(window, text="Submit Guess", command=handle_guess)
guess_button.pack()

game_feedback_label = tk.Label(window, text="", justify=tk.LEFT)
game_feedback_label.pack()

start_game_button = tk.Button(window, text="Start New Game", command=start_game)
start_game_button.pack()

#start_game()

window.mainloop()