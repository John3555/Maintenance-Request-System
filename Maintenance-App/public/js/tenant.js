// public/js/tenant.js
document.addEventListener('DOMContentLoaded', () => {
  const successMessage = document.querySelector('.success-message');
  if (successMessage) {
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
  }
});
