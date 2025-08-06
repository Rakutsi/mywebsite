document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.getElementById("spel-gallery");
  const popup = document.getElementById("popup");
  const popupImg = document.getElementById("popup-img");
  const closeBtn = document.getElementById("close-popup");

  const folderId = "1K2BewZlayhDCKmcxPyv83Jf9J3PtnQso"; // ← din Google Drive-mapp
  const apiKey = "AIzaSyBxxvWGKXgAhH6HQMtREAGkZSMebtvr5jk"; // ← din API-nyckel

  // Öppna popup med bild
  function openPopup(imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    img.onload = function () {
      popupImg.src = imageSrc;
      popup.classList.add("active");
    };
    img.onerror = function () {
      console.error("Kunde inte ladda bilden: " + imageSrc);
    };
  }

  // Hämta bilder från Google Drive
  async function fetchDriveImages() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.files || data.files.length === 0) {
        console.error("Inga filer hittades i mappen.");
        return;
      }

      gallery.innerHTML = "";

      data.files.forEach(file => {
        if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
          const img = document.createElement("img");
          img.src = `https://drive.google.com/uc?export=view&id=${file.id}`;
          img.alt = file.name;
          img.classList.add("gallery-img");

          img.addEventListener("click", () => {
            openPopup(img.src);
          });

          gallery.appendChild(img);
        }
      });
    } catch (error) {
      console.error("Fel vid hämtning av bilder:", error);
    }
  }

  // Stäng popup
  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  popup.addEventListener("click", function (e) {
    if (e.target === popup) {
      popup.classList.remove("active");
    }
  });

  // Starta
  fetchDriveImages();
});
