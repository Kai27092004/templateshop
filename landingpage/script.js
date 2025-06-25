function scrollToFeatures() {
  const features = document.getElementById('landing-sample');
  if (features) {
    features.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToRegister() {
  const regBtn = document.getElementById('register');
  if (regBtn) {
    regBtn.scrollIntoView({ behavior: 'smooth' });
  }
}