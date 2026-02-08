# TODO: Implement Winning Cells Highlight Feature

## Server-Side Changes (server/index.js)
- [x] Modify `checkWin` method to return winning cell positions instead of boolean
- [x] Update `makeMove` to store winning cells when a win occurs
- [x] Include `winningCells` in game state emissions

## Client-Side Changes (client/src/components/GameBoard.jsx)
- [ ] Update component to receive and handle `winningCells` from game state
- [ ] Add border/highlight styling for winning cells when game is over

## Testing
- [x] Test win detection and highlighting for all directions (horizontal, vertical, diagonal)
- [x] Ensure no performance issues or UI glitches
