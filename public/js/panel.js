/* Remove Project */
const removeModalClsBtn = document.getElementById('removeModalClsBtn');
const removeModalTitle = document.getElementById('remove_modal_title');
const removeModalDescription = document.getElementById(
  'remove_modal_description'
);
const removeModalImage = document.getElementById('remove_modal_img');
const removeModalRemoveBtn = document.getElementById('remove_modal_remove_btn');

function remove(id) {
  const project = projects.find((p) => p.id === id);
  const removeModal = document.getElementById('portfolioRemoveModal');
  var myModal = (removeModalTitle.textContent = project.title);
  removeModalDescription.textContent =
    project.description.substring(0, 50) +
    (project.description.length > 50 ? '...' : '');
  removeModalImage.setAttribute('src', project.photo);
  removeModalImage.setAttribute('alt', project.title + 'Image');
  removeModalRemoveBtn.setAttribute('project', project.id);
  removeModalRemoveBtn.addEventListener('click', clickHandler);

  function clickHandler(evt) {
    const projectId = evt.target.getAttribute('project');
    evt.target.innerHTML = getBtnSpinner('Removing...');
    evt.target.setAttribute('disabled', '');

    fetch(`/project/${projectId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('İşlem başarısız.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status == 'success') {
          document.querySelector(`[portfolio='${projectId}']`).remove();
          showAlert(data.message, 'success');
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        showAlert(error, 'error');
      })
      .finally(() => {
        removeModalClsBtn.click();
        evt.target.innerHTML = 'Remove';
        evt.target.removeAttribute('disabled');
      });

    removeModalRemoveBtn.removeEventListener('click', clickHandler);
  }
}

function showAlert(message, type = 'info') {
  const alert = document.getElementById(`${type}-alert`);
  const alertMessage = document.getElementById(`${type}-message`);
  const portfolioGridContainer = document.querySelector(
    '.portfolio-grid-container'
  );

  alert.style.opacity = 0;
  alert.classList.add('d-flex');
  alert.classList.remove('d-none');

  portfolioGridContainer.style.marginTop = `${alert.offsetHeight - 10}px`;

  // Hide alert
  setTimeout(function () {
    alert.style.opacity = 0;
    alert.classList.add('d-none');
    alert.classList.remove('d-flex');
    portfolioGridContainer.style.marginTop = 0;
  }, 2250);

  // Show alert
  setTimeout(function () {
    alert.style.opacity = 1;
  }, 100);

  // Alert message
  alertMessage.textContent = message;
}

function getBtnSpinner(text = 'Loading...') {
  return `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ${text}`;
}
