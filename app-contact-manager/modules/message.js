export default (message = '', type = 'primary') => {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add(
    'alert',
    `alert-${type}`,
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );

  messageContainer.innerHTML = message;

  // Add a close button to notificationBar (optionally, also a timer)

  const closeButton = document.createElement('div');
  closeButton.classList.add('btn');
  closeButton.textContent = 'x';
  messageContainer.append(closeButton);

  closeButton.addEventListener('click', () => {
    messageContainer.remove();
  });

  return messageContainer;
};
