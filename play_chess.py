import chess
import chess.engine

STOCKFISH_PATH = r"C:\Users\patta\Downloads\Programming\03_RnD\10_chess\stockfish.exe"

def play_game():
    board = chess.Board()
    engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)
    
    print("Chess Game - You play as WHITE")
    print("Enter moves in UCI format (e.g., e2e4)")
    print("Type 'quit' to exit\n")
    
    while not board.is_game_over():
        print("\n" + str(board) + "\n")
        
        if board.turn == chess.WHITE:
            move_str = input("Your move: ").strip().lower()
            
            if move_str == 'quit':
                break
                
            try:
                move = chess.Move.from_uci(move_str)
                if move in board.legal_moves:
                    board.push(move)
                else:
                    print("Illegal move! Try again.")
                    continue
            except:
                print("Invalid format! Use format like: e2e4")
                continue
        else:
            print("Stockfish is thinking...")
            result = engine.play(board, chess.engine.Limit(time=1.0))
            print(f"Stockfish plays: {result.move}")
            board.push(result.move)
    
    print("\n" + str(board))
    print("\nGame Over!")
    print(f"Result: {board.result()}")
    
    engine.quit()

if __name__ == "__main__":
    play_game()
