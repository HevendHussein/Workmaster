import pandas as pd
import matplotlib.pyplot as plt
import os

# CSV-Datei lesen (passen Sie den Pfad und das Trennzeichen an)
df = pd.read_csv('C:/Sicherung/Hevend/Bachelorarbeit/Mobility/datenbank/day1.csv', delimiter=';')

# Anzeigen der ersten Zeilen der CSV-Datei zum Überprüfen
print(df.head())

# Dummy-Daten für 14 Tage
average_steps_last_day = [1000, 1500, 1200, 1600, 1300, 1400, 1700, 1800, 1500, 1600, 1750, 1850, 1900, 2000]
average_last_click = [5, 7, 6, 8, 6, 7, 7, 9, 8, 6, 7, 7, 8, 9]
average_poisened = [3, 4, 2, 5, 3, 4, 3, 5, 4, 3, 4, 4, 3, 5]
average_potion_click = [2, 2, 3, 2, 3, 2, 3, 4, 2, 3, 2, 3, 4, 3]

# Konvertieren Sie die 'steps'-Spalte und 'stepsLastDay'-Spalte in numerische Werte und setzen Sie Fehler in NaN um
df['steps'] = pd.to_numeric(df['steps'], errors='coerce')
df['stepsLastDay'] = pd.to_numeric(df['stepsLastDay'], errors='coerce')

# Ersetzen Sie NaN-Werte durch 0
df['steps'] = df['steps'].fillna(0)
df['stepsLastDay'] = df['stepsLastDay'].fillna(0)

# Annahme: Die CSV-Datei hat die Spalten 'name', 'steps' und 'stepsLastDay'
# Falls die Spaltennamen anders sind, passen Sie den Code entsprechend an
users = df['name'].tolist()
steps = df['steps'].tolist()
steps_last_day = df['stepsLastDay'].tolist()

# Erstellen Sie einen Ordner zum Speichern der Graphen, falls dieser nicht existiert
output_folder = 'C:/Sicherung/Hevend/Bachelorarbeit/Mobility/datenbank/graphs'
os.makedirs(output_folder, exist_ok=True)

# Balkendiagramm für 'steps' erstellen und speichern
plt.figure(figsize=(10, 6))
plt.bar(users, steps, color='blue')
plt.xlabel('User')
plt.ylabel('Steps')
plt.title('Steps per User')
plt.xticks(rotation=90)  # Drehung der x-Achsen-Beschriftungen
plt.tight_layout()  # Automatische Anpassung des Layouts
plt.savefig(os.path.join(output_folder, 'steps_per_user.png'))
plt.close()

# Balkendiagramm für 'stepsLastDay' erstellen und speichern
plt.figure(figsize=(10, 6))
plt.bar(users, steps_last_day, color='green')
plt.xlabel('User')
plt.ylabel('Steps Last Day')
plt.title('Steps Last Day per User')
plt.xticks(rotation=90)  # Drehung der x-Achsen-Beschriftungen
plt.tight_layout()  # Automatische Anpassung des Layouts
plt.savefig(os.path.join(output_folder, 'steps_last_day_per_user.png'))
plt.close()

# Tage 1 bis 14
days = list(range(1, 15))

# Graphen erstellen und speichern
graph_data = [
    (days, average_steps_last_day, 'b', 'Steps Last Day', 'Durchschnittliche Schritte pro Tag', 'average_steps_last_day.png'),
    (days, average_last_click, 'r', 'Anzahl Daily Mission Starts', 'Gesamte Anzahl der Daily Mission Starts pro Tag', 'average_last_click.png'),
    (days, average_poisened, 'g', 'Anzahl an vergifteten Usern', 'Gesamte Anzahl der vergifteten User pro Tag', 'average_poisened.png'),
    (days, average_potion_click, 'm', 'Anzahl an aufgehobenen Heil-Tränken', 'Gesamte Anzahl der aufgehobenen Heil-Tränke pro Tag', 'average_potion_click.png')
]

for x, y, color, ylabel, title, filename in graph_data:
    plt.figure(figsize=(10, 6))
    plt.plot(x, y, marker='o', linestyle='-', color=color)
    plt.xlabel('Tag')
    plt.ylabel(ylabel)
    plt.title(title)
    plt.grid(True)
    plt.savefig(os.path.join(output_folder, filename))
    plt.close()

# Analyse der täglichen Aktionen
for column in ['lastClick', 'poisened', 'potionClick']:
    count = df[column].sum()
    total_users = len(df)
    print(f"{count} von {total_users} Usern haben {column} benutzt.")

# Durchschnitt der stepsLastDay berechnen
average_steps_last_day = df['stepsLastDay'].mean()
print(f"Der Durchschnitt der 'stepsLastDay' beträgt: {average_steps_last_day:.2f}")
