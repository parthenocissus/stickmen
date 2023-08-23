def my_function():
    print("Executing the function...")


while True:
    user_input = input("Press 'g' to execute the function or 's' to stop: ")

    if user_input == 'g':
        my_function()
    elif user_input == 's':
        print("Stopping the program.")
        break
    else:
        print("Invalid input. Press 'g' to execute the function or 's' to stop.")
