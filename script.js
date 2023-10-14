var page = "<p></p>";
var myWindow = null;

function openWin(selectedBoardNumber) {
  if (myWindow != null) myWindow.close();

  const windowSize = 800; // Adjust this value as needed
  myWindow = window.open("", "", `width=${windowSize},height=${windowSize}`);

  // Get the selected background color from the color picker input
  const bgColorPicker = document.getElementsByClassName("bgColorPicker");
  const selectedBgColor = bgColorPicker.value;

  // Apply the selected background color to the opened window
  myWindow.document.body.style.backgroundColor = selectedBgColor;

  // Set the background image based on the selected board number
  const selectedBoardImage = document.querySelector(
    `.board-tile:nth-child(${selectedBoardNumber}) img`
  ).src;
  myWindow.document.body.style.backgroundImage = `url(${selectedBoardImage})`;
  myWindow.document.body.style.backgroundSize = "cover";
  myWindow.document.body.style.backgroundRepeat = "no-repeat";
  myWindow.document.body.style.backgroundPosition = "center";

  // Add a centered header at the bottom
  // Create a container for the header
  const headerContainer = myWindow.document.createElement("div");
  headerContainer.style.position = "absolute";
  headerContainer.style.bottom = "10px";
  headerContainer.style.left = "50%";
  headerContainer.style.transform = "translateX(-50%)";
  headerContainer.style.backgroundColor = "rgba(255, 255, 255, 1)";
  headerContainer.style.padding = "10px";
  headerContainer.style.borderRadius = "5px";
  headerContainer.style.border = "solid black";

  // Add a header inside the container
  const header = myWindow.document.createElement("h1");
  header.textContent = "Move Your Pieces Around!";

  // Append the header to the container
  headerContainer.appendChild(header);

  // Append the container to the opened window's body
  myWindow.document.body.appendChild(headerContainer);

  // Generate the HTML for selected game pieces in a grid layout and insert it into the opened window
  const selectedPieces = document.querySelectorAll(".game-piece-tile.clicked");
  let top = 0;
  let left = 0;
  const gridSpacing = 50; // Adjust the spacing between pieces

  selectedPieces.forEach((piece) => {
    const pieceImage = piece.querySelector("img").src;
    const pieceAlt = piece.querySelector("img").alt;
    const quantity = getPieceQuantity(pieceAlt); // Get the quantity from the slider

    for (let i = 0; i < quantity; i++) {
      const pieceHTML = `<span onmousedown="grabber(event);" style="position: absolute; top: ${top}px; left: ${left}px;">
                <img src="${pieceImage}" alt="${pieceAlt}" style="width: 50px; height: 50px;">
              </span>`;
      myWindow.document.body.innerHTML += pieceHTML;

      // Update the position for the next piece in the same row
      left += gridSpacing;

      // After a certain number of pieces in a row, move to the next row
      if (i % 5 === 4) {
        top += gridSpacing;
        left = 0;
      }
    }
  });

  // Include the JavaScript code from dragNDrop.js within the opened window's script tag
  const scriptBlock = myWindow.document.createElement("script");
  scriptBlock.type = "text/javascript";
  scriptBlock.innerHTML = `

  var diffX, diffY, theElement;

  function grabber(event) {

    theElement = event.currentTarget;

    var posX = parseInt(theElement.style.left);
    var posY = parseInt(theElement.style.top);

    diffX = event.clientX - posX;
    diffY = event.clientY - posY;

    document.addEventListener("mousemove", mover, true);
    document.addEventListener("mouseup", dropper, true);

    event.stopPropagation();
    event.preventDefault();
  }

  function mover(event) {

    theElement.style.left = event.clientX - diffX + "px";
    theElement.style.top = event.clientY - diffY + "px";

    event.stopPropagation();
  }

  function dropper(event) {

    document.removeEventListener("mouseup", dropper, true);
    document.removeEventListener("mousemove", mover, true);

    event.stopPropagation();
  }
    `;

  myWindow.document.head.appendChild(scriptBlock);
}

// Helper function to get the quantity of a selected game piece based on its alt text
function getPieceQuantity(pieceAlt) {
  const quantityInput = document.querySelector(
    `.selected-pieces-table tr[data-piece="${pieceAlt}"] input.quantity-slider`
  );
  if (quantityInput) {
    return parseInt(quantityInput.value, 10);
  }
  return 0; // Default to 0 if not found
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
