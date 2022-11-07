const httpGetAsync = (theUrl, callback) =>
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true)
    xmlHttp.send(null);
}

const imgToBase64 = url => fetch(url)
  .then(res => res.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

let imagesOnPage = document.getElementsByTagName("img")

const cb = () => {
  for (let img of imagesOnPage) {
    //img.addEventListener("click", logSRC(img.getAttribute("src")), false)
    let imgSRC = img.getAttribute('src')
    imgToBase64(imgSRC)
      .then(b64str => {
        img.addEventListener('click', () => httpGetAsync(`http://localhost:8000/caption/${b64str}`, (res) => console.log(res)))
      }
        )
  }
}


setTimeout (cb, 1000)