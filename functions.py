from fuzzywuzzy import process


def check_guess(cookies_df):
    """
    The check_guess function serves multiple purposes. First, It directs the user to provide an input (their guess) so
    that it can be checked. The guess is examined to make sure there is a string value provided, and if so, checks to
    ensure the string exists in the database. In the event that there is a potential misspelling, the code provides
    potential correct spellings. If the checks are not met, the user is prompted to retry. If all checks are met, the
    function returns guessed_cookie in a panda Series object.

    :param cookies_df: panda dataframe
    :return guessed_cookie: panda Series
    """

    cookie_names = cookies_df['cookie_name'].tolist()
    cookie_names_lower = {name.lower(): name for name in cookie_names}

    while True:
        guess = input("\nEnter your guess for the cookie name (please use caps for every first letter): ")

        if not guess:
            print("The guess you provided is empty, please try again.")
            continue

        if type(guess) is not str:
            print("The guess you provided is not a string, please try again.")
            continue

        if guess.strip().lower() in cookie_names_lower:
            guessed_cookie = get_cookie_attributes(guess, cookies_df)
            return guessed_cookie

        print("Sorry, that cookie is not in the database, please try again.")

        suggestions = process.extract(guess, cookie_names, limit=2)
        suggestions = [(name, score) for name, score in suggestions if score >= 90]

        if suggestions:
            print("Did you potentially mean one of these cookies?")
            for suggestion in suggestions:
                print(f"- {suggestion[0]} (Similarity: {suggestion[1]}%)")

        continue


def get_cookie_attributes(cookie_name, df):
    """
    The get_cookie_attributes function takes the cookie name and references the database to find that cookie's
    attributes and return them to the user in a panda Series variable.

    :param cookie_name: str
    :param df: pandas dataframe
    :return guessed_cookie: pandas Series
    """
    cookie = df[df['cookie_name'].str.lower() == cookie_name.lower()]
    if not cookie.empty:
        guessed_cookie = cookie.iloc[0]
        return guessed_cookie
    else:
        return None


def check_cookie_guess(guess, selected_cookie):
    """
    Simple function to return a Bool value whether the cookie name of the guess is equal to the selected cookie name

    :param guess: panda Series
    :param selected_cookie: panda Series
    :return: boolean
    """
    return str(guess['cookie_name']).strip().lower() == str(selected_cookie['cookie_name']).strip().lower()


def give_feedback(guess, selected_cookie):
    """
    The function give_feedback checks whether the cookie name matches the selected cookie name. If yes, then the user
    wins and the provided dialog is returned. If not, the feedback is added to and the user is provided with hints to
    the rarity, type, and position of the cookie

    :param guess: panda Series
    :param selected_cookie: panda Series
    :return: str, list
    """
    feedback = []

    if check_cookie_guess(guess, selected_cookie):
        return "Correct! You've guessed the right cookie!"

    if not check_cookie_guess(guess, selected_cookie):
        feedback.append("Incorrect guess for the cookie name.")

    for attribute in ['primary_color', 'secondary_color', 'rarity', 'type', 'position']:
        correct_cookie_value = selected_cookie[attribute]
        guess_cookie_value = guess[attribute]

        if str(correct_cookie_value).strip().lower() == str(guess_cookie_value).strip().lower():
            if attribute == 'primary_color':
                feedback.append(f"The Primary Color {guess[f'{attribute}']} matches!")
                feedback.append(guess[f'{attribute}'])
            elif attribute == 'secondary_color':
                feedback.append(f"The Secondary Color {guess[f'{attribute}']} matches!")
                feedback.append(guess[f'{attribute}'])
            else:
                feedback.append(f"The {guess[f'{attribute}']} {attribute} matches!")
                feedback.append(guess[f'{attribute}'])
        else:
            if attribute == 'primary_color':
                feedback.append(f"The Primary Color {guess[f'{attribute}']} does not match.")
                feedback.append(guess[f'{attribute}'])
            elif attribute == 'secondary_color':
                feedback.append(f"The Secondary Color {guess[f'{attribute}']} does not match.")
                feedback.append(guess[f'{attribute}'])
            else:
                feedback.append(f"The {guess[f'{attribute}']} {attribute} does not match.")
                feedback.append(guess[f'{attribute}'])

    return '\n'.join(feedback)


def play_game(selected_cookie, cookies_df):
    """
    The user plays the game! Outputs are given depending on whether the user is correct or incorrect.

    :param selected_cookie: pandas Series
    :param cookies_df: pandas dataframe
    :return:
    """
    print("Welcome to the Cookie Guessing Game Rayndeer!")
    print("This functions similarly to Loldle and Pokedle, please give it a try! I love you")

    guesses = 0
    correct = False

    while not correct:

        guessed_cookie = check_guess(cookies_df)

        guesses += 1

        if check_cookie_guess(guessed_cookie, selected_cookie):
            print(f"Correct! You've guessed the cookie in {guesses} guesses!")
            print(f"{selected_cookie['cookie_name']}, {selected_cookie['primary_color']}, {selected_cookie['secondary_color']}, "
                  f"{selected_cookie['rarity']}, {selected_cookie['type']}, {selected_cookie['position']}, "
                  f"{selected_cookie['skill_name'], int(selected_cookie['skill_cooldown'])}")
            correct = True
        else:
            feedback = give_feedback(guessed_cookie, selected_cookie)
            print(feedback)
