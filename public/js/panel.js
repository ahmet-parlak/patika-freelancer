// ----------------------------------------------
// ADD PROJECT
// ----------------------------------------------
const addProjectForm = document.getElementById('addProjectForm');

addProjectForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title_input').value;
  const description = document.getElementById('description_input').value;
  const image = document.getElementById('photo_input').files[0];

  const formData = new FormData();

  formData.append('title', title);
  formData.append('description', description);
  formData.append('image', image);

  fetch('/project', { method: 'POST', body: formData })
    .then((response) => {
      removeAddProjectFormAlerts();
      if (!response.ok && response.status !== 400) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((response) => {
      if (response.status === 'success') {
        const project = response.data;

        showAlert(response.message, 'success');
        addProjectToPortfolio(project);
        projects.push(project);
        document.getElementById('addModalCloseBtn').click();
        event.target.reset();
      } else {
        if (Array.isArray(response.data)) {
          response.data.map((error) => {
            addAddProjectFormAlert(error);
          });
        } else {
          addAddProjectFormAlert(response.message);
        }
      }
    })
    .catch((err) => {
      addAddProjectFormAlert(err, 'error');
    });
});

// ----------------------------------------------
// REMOVE PROJECT
// ----------------------------------------------
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

// ----------------------------------------------
// Helpers
// ----------------------------------------------
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

function addAddProjectFormAlert(message) {
  const formAlerts = document.getElementById('add-form-alerts-container');

  formAlerts.innerHTML += `<div  class="alert alert-danger d-flex align-items-center mt-4" role="alert">
  ${message}
  </div>`;
}

function removeAddProjectFormAlerts() {
  const formAlerts = document.getElementById('add-form-alerts-container');

  formAlerts.innerHTML = '';
}

function clearAddProjectForm() {}

function getBtnSpinner(text = 'Loading...') {
  return `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ${text}`;
}

function addProjectToPortfolio(project) {
  const newProject = `
    <div class="col-md-6 col-lg-4 mb-5" portfolio="${project.id}">
        <div class="portfolio-item mx-auto position-relative" data-bs-toggle="modal" data-bs-target="#portfolioModal" onclick="showDetails('${project.id}')">
          <div class="portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100">
            <div class="portfolio-item-caption-content text-center text-white"><i class="fas fa-plus fa-3x"></i></div>
          </div>

          <!-- Edit Button -->
          <div class="portfolio-item-caption-content position-absolute bottom-0 end-0 m-1" data-bs-toggle="modal" data-bs-target="#portfolioEditModal" onclick="editModal('${project.id}')">
            <div class="edit-btn text-warning p-2" title="Edit"><i class="fas fa-pen fa-2x"></i></div>
          </div>

          <!-- Remove Button -->
          <div class="portfolio-item-caption-content position-absolute top-0 end-0 m-1" data-bs-toggle="modal" data-bs-target="#portfolioRemoveModal" onclick="remove('${project.id}')">
            <div class="remove-btn text-danger px-2" title="Remove From Portfolio"><i class="fas fa-times fa-3x"></i></div>
          </div>

          <img class="img-fluid" src="${project.photo}" alt="${project.title} Image" />

        </div>
      </div>
      `;

  const portfolioGridContainer = document.querySelector(
    '.portfolio-grid-container'
  );

  portfolioGridContainer.innerHTML =
    newProject + portfolioGridContainer.innerHTML;
}
