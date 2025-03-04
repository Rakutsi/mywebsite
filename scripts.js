document.addEventListener('DOMContentLoaded', function() {
    // Referenser till popup och popup-bild
    const images = document.querySelectorAll('.gallery-img');
    const popup = document.querySelector('.popup');
    const popupImg = document.querySelector('.popup-img');
    const closeBtn = document.querySelector('.close');

   // Öppna popupen när en bild i galleriet klickas
   images.forEach(image => {
    image.addEventListener('click', () => {
        const largeImageSrc = image.src;  // Hämtar samma bild som klickas på
        openPopup(largeImageSrc);         // Skicka bildens URL till openPopup
    });
});

// Stäng popupen när stängknappen klickas
closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});

// Stäng popup när man klickar utanför bilden
popup.addEventListener('click', function(e) {
    if (e.target === popup) {
        popup.classList.remove('active');
    }
});

    // Google Drive-funktion för att hämta bilder
    const folderId = "1K2BewZlayhDCKmcxPyv83Jf9J3PtnQso"; // Ersätt med ditt Google Drive-mapp-ID
    const apiKey = "AIzaSyBxxvWGKXgAhH6HQMtREAGkZSMebtvr5jk"; // Ersätt med din Google API-nyckel

    async function fetchDriveImages() {
        const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name)`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!data.files || data.files.length === 0) {
                console.error("Inga filer hittades i mappen.");
                return;
            }

            const gallery = document.getElementById("natur-gallery");
            gallery.innerHTML = ""; // Rensar tidigare bilder

            data.files.forEach(file => {
                const img = document.createElement("img");
                img.src = `https://drive.google.com/thumbnail?id=${file.id}`;
                img.alt = file.name;
                img.classList.add('gallery-img');  // Lägg till klassen här

                // Logga för att kontrollera om bilden är korrekt
                console.log(`Bild: ${file.name} - ${img.src}`);

                // Lägg till event listener för att öppna popup när bilden klickas
img.addEventListener('click', () => {
    console.log(`Klickad på bild: ${file.name}`);
    
    // Använd rätt URL för att visa bilden i popup
    const imageUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
    
    // Öppna popup med den korrekta URL:n
    openPopup(imageUrl);
});
gallery.appendChild(img);

            });

        } catch (error) {
            console.error("Fel vid hämtning av bilder:", error);
        }
    }

    // Funktion för att hämta bilder från spel-mappen
    async function fetchSpelImages() {
        try {
            const response = await fetch('bilder/spel/'); // Ersätt med rätt sökväg
            if (!response.ok) {
                throw new Error('Kunde inte hämta bilder från mappen');
            }

            const images = await response.json();
            const gallery = document.getElementById('spel-gallery');
            gallery.innerHTML = ""; // Rensa tidigare bilder om det finns några

            images.forEach(image => {
                const img = document.createElement('img');
                img.src = `bilder/spel/${image}`; // Här är rätt sökväg till bilderna
                img.alt = image; // Bildens namn används som alt-text
                img.classList.add('gallery-img'); // Lägg till lämplig klass för styling
                // Lägg till event listener för att öppna popup vid klick
                img.addEventListener('click', () => openPopup(img.src));
                gallery.appendChild(img);
            });
        } catch (error) {
            console.error("Fel vid hämtning av bilder:", error);
        }
    }

// Funktion för att öppna popup
function openPopup(imageSrc) {
    const img = new Image();  // Skapa ett nytt Image-objekt
    img.src = imageSrc;       // Sätt bildens källa till den URL som ska visas i popupen

    // När bilden har laddats, öppna popupen
    img.onload = function() {
        popupImg.src = imageSrc;   // Uppdaterar popupens bildkälla
        popup.classList.add('active'); // Gör popupen synlig
    };

    // Hantera om det uppstår ett problem vid laddning
    img.onerror = function() {
        console.error("Kunde inte ladda bilden från: " + imageSrc);
    };
}

// Testa med en statisk bild-URL från Google Drive
openPopup('https://drive.usercontent.google.com/download?id=1Wo3zH575zfitJUfW-JJmYPSeUoz5e2Lk');



    // Kör funktionerna när sidan laddas
    fetchDriveImages();  // Hämta bilder från Google Drive (Natur)
    fetchSpelImages();   // Hämta lokala bilder för spel
});
