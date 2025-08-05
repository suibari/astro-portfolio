document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.fade-in-element');
  elements.forEach((element, index) => {
    // Add a slight delay for each element to stagger the fade-in effect
    setTimeout(() => {
      element.classList.add('visible');
    }, index * 100); // 100ms delay between each element
  });
});
