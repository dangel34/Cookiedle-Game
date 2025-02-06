import random
import pandas as pd
from functions import play_game

cookies_df = pd.read_csv('cookies_rows.csv')

selected_cookie = cookies_df.sample(n=1).iloc[0]
print(selected_cookie)

play_game(selected_cookie, cookies_df)
