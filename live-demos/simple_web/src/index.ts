import "./styles.css";

type Player = 'X' | 'O';
type CellValue = Player | null;

class TicTacToe {
    private board: CellValue[] = Array(9).fill(null);
    private currentPlayer: Player = 'X';
    private gameActive: boolean = true;
    private cells: NodeListOf<HTMLElement>;
    private statusDisplay: HTMLElement;
    private resetButton: HTMLElement;

    private readonly winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    constructor() {
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('gameStatus') as HTMLElement;
        this.resetButton = document.getElementById('resetButton') as HTMLElement;

        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    private handleCellClick(cell: HTMLElement): void {
        const index = parseInt(cell.getAttribute('data-index') || '0');

        if (this.board[index] !== null || !this.gameActive) {
            return;
        }

        this.updateCell(cell, index);
        this.checkResult();
    }

    private updateCell(cell: HTMLElement, index: number): void {
        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add('taken', this.currentPlayer.toLowerCase());
    }

    private checkResult(): void {
        let roundWon = false;
        let winningCombination: number[] = [];

        for (const condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (a === undefined || b === undefined || c === undefined) continue;
            
            const cellA = this.board[a];
            const cellB = this.board[b];
            const cellC = this.board[c];

            if (cellA === null || cellB === null || cellC === null) {
                continue;
            }

            if (cellA === cellB && cellB === cellC) {
                roundWon = true;
                winningCombination = condition;
                break;
            }
        }

        if (roundWon) {
            this.statusDisplay.textContent = `Spieler ${this.currentPlayer} hat gewonnen! 🎉`;
            this.gameActive = false;
            this.highlightWinningCells(winningCombination);
            return;
        }

        const roundDraw = !this.board.includes(null);
        if (roundDraw) {
            this.statusDisplay.textContent = 'Unentschieden! 🤝';
            this.gameActive = false;
            return;
        }

        this.switchPlayer();
    }

    private highlightWinningCells(combination: number[]): void {
        combination.forEach(index => {
            const cell = this.cells[index];
            if (cell) {
                cell.classList.add('winner');
            }
        });
        this.launchConfetti();
    }

    private launchConfetti(): void {
        const colors = ['#00ff88', '#ff0088', '#ffcc00', '#00ccff', '#ff6600', '#cc00ff'];
        const confettiCount = 150;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random starting position across the top
            const startX = Math.random() * window.innerWidth;
            confetti.style.left = `${startX}px`;
            confetti.style.top = '-10px';
            
            // Random color
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            if (randomColor) {
                confetti.style.backgroundColor = randomColor;
            }
            
            // Random size
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random animation duration and delay
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            confetti.style.animationDuration = `${duration}s`;
            confetti.style.animationDelay = `${delay}s`;
            
            // Random horizontal drift
            const drift = (Math.random() - 0.5) * 200;
            confetti.style.setProperty('--drift', `${drift}px`);
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }
    }

    private switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = `Spieler ${this.currentPlayer} ist am Zug`;
    }

    private resetGame(): void {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.statusDisplay.textContent = 'Spieler X ist am Zug';

        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken', 'x', 'o', 'winner');
        });
    }
}

// Initialisiere das Spiel
new TicTacToe();
