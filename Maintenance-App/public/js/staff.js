// public/js/staff.js
document.addEventListener('DOMContentLoaded', () => {
  const filtersForm = document.querySelector('#filters-form');
  if (filtersForm) {
    filtersForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const params = new URLSearchParams(new FormData(filtersForm)).toString();
      window.location.href = `/requests?${params}`;
    });
  }
});
