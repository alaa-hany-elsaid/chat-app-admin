function displayLoader() {
    let loader = document.getElementById('loader')
    if (loader) {
        loader.style.display = 'flex'
    }
}

function hideLoader() {
    let loader = document.getElementById('loader')
    if (loader) {
        loader.style.display = 'none'
    }
}

export {hideLoader, displayLoader};