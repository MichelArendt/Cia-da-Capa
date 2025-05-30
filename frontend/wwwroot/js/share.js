window.canShareNatively = () => {
    return !!navigator.share;
};

window.shareProduct = (title, text, url) => {
    if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => { });
    } else {
        alert("Compartilhamento nativo não suportado neste dispositivo.");
    }
};