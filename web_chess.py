from flask import Flask, render_template, request, jsonify
import chess
import chess.engine
import chess.pgn
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Add after app initialization

STOCKFISH_PATH = r"C:\Users\patta\Downloads\Programming\03_RnD\10_chess\stockfish.exe"
board = chess.Board()
engine = None
move_history = []

def init_engine():
    global engine
    if engine is None:
        engine = chess.engine.SimpleEngine.popen_uci(STOCKFISH_PATH)

@app.route('/')
def index():
    return render_template('chess.html')

@app.route('/new_game', methods=['POST'])
def new_game():
    global board, move_history
    board = chess.Board()
    move_history = []
    return jsonify({'fen': board.fen(), 'status': 'New game started'})

@app.route('/analyze_position', methods=['POST'])
def analyze_position():
    init_engine()
    data = request.json
    fen = data.get('fen', board.fen())
    temp_board = chess.Board(fen)
    
    # Get top 3 moves with analysis
    info = engine.analyse(temp_board, chess.engine.Limit(depth=20), multipv=3)
    
    top_moves = []
    for i, variation in enumerate(info):
        move = variation['pv'][0] if variation['pv'] else None
        score = variation['score'].relative.score(mate_score=10000) if variation['score'] else 0
        
        # Convert centipawns to evaluation
        eval_score = score / 100.0 if score is not None else 0
        
        # Get explanation for the move
        explanation = get_move_explanation(temp_board, move, eval_score, i+1)
        
        top_moves.append({
            'move': move.uci() if move else None,
            'san': temp_board.san(move) if move else None,
            'evaluation': eval_score,
            'rank': i + 1,
            'explanation': explanation
        })
    
    return jsonify({
        'top_moves': top_moves,
        'position_evaluation': top_moves[0]['evaluation'] if top_moves else 0
    })

def get_move_explanation(board, move, eval_score, rank):
    if not move:
        return 'No legal moves available'
    
    piece = board.piece_at(move.from_square)
    piece_name = chess.piece_name(piece.piece_type).capitalize()
    
    explanations = []
    
    # Rank-based explanation
    if rank == 1:
        explanations.append(f'Best move')
    elif rank == 2:
        explanations.append(f'Second best')
    else:
        explanations.append(f'Third best')
    
    # Capture detection
    if board.is_capture(move):
        captured = board.piece_at(move.to_square)
        if captured:
            explanations.append(f'captures {chess.piece_name(captured.piece_type)}')
    
    # Check detection
    board_copy = board.copy()
    board_copy.push(move)
    if board_copy.is_check():
        explanations.append('gives check')
    
    # Development
    if piece and piece.piece_type in [chess.KNIGHT, chess.BISHOP]:
        if move.from_square in [chess.B1, chess.G1, chess.C1, chess.F1, chess.B8, chess.G8, chess.C8, chess.F8]:
            explanations.append('develops piece')
    
    # Castling
    if board.is_castling(move):
        explanations.append('castles king to safety')
    
    # Evaluation context
    if abs(eval_score) > 3:
        explanations.append('winning advantage' if eval_score > 0 else 'losing position')
    elif abs(eval_score) > 1:
        explanations.append('significant advantage' if eval_score > 0 else 'disadvantage')
    else:
        explanations.append('balanced position')
    
    return f'{piece_name} {chess.square_name(move.from_square)} to {chess.square_name(move.to_square)}: ' + ', '.join(explanations)

@app.route('/make_move', methods=['POST'])
def make_move():
    global board, move_history
    data = request.json
    move_uci = data.get('move')
    
    try:
        move = chess.Move.from_uci(move_uci)
        if move in board.legal_moves:
            move_history.append({
                'move': board.san(move),
                'fen': board.fen(),
                'number': len(move_history) + 1
            })
            board.push(move)
            
            if board.is_game_over():
                return jsonify({
                    'fen': board.fen(),
                    'legal_moves': [],
                    'game_over': True,
                    'result': board.result(),
                    'move_history': move_history
                })
            
            # Stockfish's turn
            init_engine()
            result = engine.play(board, chess.engine.Limit(time=1.0))
            move_history.append({
                'move': board.san(result.move),
                'fen': board.fen(),
                'number': len(move_history) + 1
            })
            board.push(result.move)
            
            return jsonify({
                'fen': board.fen(),
                'stockfish_move': result.move.uci(),
                'legal_moves': [m.uci() for m in board.legal_moves],
                'game_over': board.is_game_over(),
                'result': board.result() if board.is_game_over() else None,
                'move_history': move_history
            })
        else:
            return jsonify({'error': 'Illegal move'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/hint', methods=['GET'])
def get_hint():
    init_engine()
    result = engine.play(board, chess.engine.Limit(time=0.5))
    return jsonify({
        'hint_move': result.move.uci(),
        'hint_san': board.san(result.move)
    })

if __name__ == '__main__':
    init_engine()
    app.run(debug=True, port=5000)
