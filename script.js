var page = "<p>ISP</p>";
var myWindow = null;

function openWin() {
  if (myWindow != null) myWindow.close();
  myWindow = window.open("", "ISP", "width=800,height=168");
  myWindow.document.write(page);
}

function closeWindow() {
  myWindow.close();
}

function selectBoard(boardNumber) {
  // Remove the "clicked" class from all board tiles
  const boardTiles = document.querySelectorAll(".board-tile");
  boardTiles.forEach((tile) => {
    tile.classList.remove("clicked");
  });

  // Add the "clicked" class to the selected board tile
  const selectedTile = document.querySelector(
    `.board-tile:nth-child(${boardNumber})`
  );
  selectedTile.classList.add("clicked");
}

function toggleTileSelection(tileElement) {
  if (tileElement.classList.contains("clicked")) {
    tileElement.classList.remove("clicked");
  } else {
    tileElement.classList.add("clicked");
  }
}

function selectPiece(pieceNumber) {
  // Find the selected tile
  const selectedTile = document.querySelector(
    `.game-piece-tile:nth-child(${pieceNumber})`
  );

  // Toggle the selection state
  toggleTileSelection(selectedTile);
}
