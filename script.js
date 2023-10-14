var page = "<p>ISP</p>";
var myWindow = null;

function openWin() {
  if (myWindow != null) myWindow.close();
  myWindow = window.open("", "TITLE", "width=800,height=168");
  myWindow.document.write(page);
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
