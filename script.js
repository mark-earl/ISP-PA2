var page = "<p></p>";
var myWindow = null;

function openWin(selectedBoardNumber) {
  if (myWindow != null) myWindow.close();

  const windowSize = 800; // Adjust this value as needed
  myWindow = window.open("", "", `width=${windowSize},height=${windowSize}`);

  // Set the background image based on the selected board number
  const selectedBoardImage = document.querySelector(
    `.board-tile:nth-child(${selectedBoardNumber}) img`
  ).src;
  myWindow.document.body.style.backgroundImage = `url(${selectedBoardImage})`;
  myWindow.document.body.style.backgroundSize = "cover";
  myWindow.document.body.style.backgroundRepeat = "no-repeat";
  myWindow.document.body.style.backgroundPosition = "center";

  // Generate the HTML for selected game pieces and insert it into the opened window
  const selectedPieces = document.querySelectorAll(".game-piece-tile.clicked");
  const pieceHTML = Array.from(selectedPieces)
    .map((piece, index) => {
      return `<div style="position: absolute; top: ${100 * index}px; left: ${
        100 * index
      }px;">
                <img src="${piece.querySelector("img").src}" alt="${
        piece.querySelector("img").alt
      }" style="width: 50px; height: 50px;"> <!-- Set the desired width and height -->
              </div>`;
    })
    .join("");

  myWindow.document.body.innerHTML += pieceHTML;
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

  // Check if the piece is already selected (clicked)
  const isClicked = selectedTile.classList.contains("clicked");

  if (isClicked) {
    // If the piece is already selected, remove it
    selectedTile.classList.remove("clicked");

    // Get the alt text of the selected piece
    const altText = selectedTile.querySelector("img").alt;

    // Find the corresponding row in the table
    const existingRow = document.querySelector(
      `.selected-pieces-table tr[data-piece="${altText}"]`
    );

    if (existingRow) {
      // If the piece is in the table, remove the row
      existingRow.remove();
    }
  } else {
    // If the piece is not already selected, add it to the table

    // Toggle the selection state
    toggleTileSelection(selectedTile);

    // Get the image source and alt text from the selected tile
    const imageSrc = selectedTile.querySelector("img").src;
    const altText = selectedTile.querySelector("img").alt;

    // If the piece is not in the table, add a new row
    const tableBody = document.querySelector(".selected-pieces-table tbody");
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-piece", altText);

    newRow.innerHTML = `
      <td>
        <img src="${imageSrc}" class="piece-image-small" alt="${altText}">
      </td>
      <td>
        <input
          type="range"
          class="quantity-slider"
          min="1"
          max="10"
          value="1"
          oninput="updateQuantity(this, '${altText}')"
        >
        <span class="quantity-value">1</span>
      </td>
    `;

    tableBody.appendChild(newRow);
  }
}

function updateQuantity(slider, pieceName) {
  const quantityValue = slider.nextElementSibling;
  quantityValue.textContent = slider.value;
}

function getSelectedBoardNumber() {
  const boardTiles = document.querySelectorAll(".board-tile");
  for (let i = 0; i < boardTiles.length; i++) {
    if (boardTiles[i].classList.contains("clicked")) {
      return i + 1; // Add 1 because the index is 0-based
    }
  }
  return 1; // Default to the first board if none is selected
}
