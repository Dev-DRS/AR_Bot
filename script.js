// Handles loading the events for <model-viewer>'s slotted progress bar

const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
document.querySelector('model-viewer').addEventListener('progress', onProgress);

// Migrated Code //
document.querySelectorAll('.next-button').forEach(button => {
  button.addEventListener('click', function () {
      const currentModal = this.closest('.modal');
      const nextModalId = this.getAttribute('data-next');
      if (nextModalId === 'done') {
          currentModal.style.display = 'none';
      } else {
          const nextModal = document.getElementById(nextModalId);
          currentModal.classList.add('modal-slide-out-left');
          currentModal.addEventListener('animationend', () => {
              currentModal.style.display = 'none';
              currentModal.classList.remove('modal-slide-out-left');
          });
          nextModal.style.display = 'block';
          nextModal.classList.add('modal-slide-in-right');
          nextModal.addEventListener('animationend', () => {
              nextModal.classList.remove('modal-slide-in-right');
          });
      }
  });
});

// Function to show only the settings icon
const settingIcon = document.getElementById('setting-icon');

// document.addEventListener('DOMContentLoaded', function() {
//     const modelViewer = document.querySelector("#model-viewer");

//     // Function to activate AR mode
//     function activateAR() {
//         if (modelViewer.canActivateAR) {
//             modelViewer.activateAR();
//         }
//     }

//     // Event listener for the Start button
//     document.getElementById('start-button').addEventListener('click', function() {
//         document.getElementById('Help').style.display = 'none';
//         document.getElementById('responseText-area').style.display = 'block';
//         document.getElementById('recBtn').style.display = 'block';
//         document.getElementById('menu-open').style.display = 'none';
//         document.getElementById('startModal').style.display = 'none';

//         // Activate AR mode
//         activateAR();
//     });

//     // Listen for AR activation and display buttons
//     modelViewer.addEventListener('ar-status', (event) => {
//         if (event.detail.status === 'session-started') {
//             document.getElementById('ar-buttons').style.display = 'block'; // Use JavaScript to show buttons
//         }
//     });

//     // Toggle animation functionality
//     document.getElementById('toggle-animation').addEventListener('change', function() {
//         if (this.checked) {
//             modelViewer.animationName = 'explode';
//             modelViewer.play();
//         } else {
//             modelViewer.animationName = '';
//             modelViewer.pause();
//         }
//     });

//     // Change color functionality
//     document.getElementById('change-color').addEventListener('click', function() {
//         const material = modelViewer.model.materials[0];
//         material.pbrMetallicRoughness.setBaseColorFactor([Math.random(), Math.random(), Math.random(), 1]);
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
  const modelViewer = document.querySelector("#model-viewer");

  // Function to activate AR mode
  function activateAR() {
      if (modelViewer.canActivateAR) {
          modelViewer.activateAR();
      }
  }

  // Event listener for the Start button
  document.getElementById('start-button').addEventListener('click', function() {
      document.getElementById('Help').style.display = 'none';
      document.getElementById('responseText-area').style.display = 'block';
      document.getElementById('recBtn').style.display = 'block';
      document.getElementById('menu-open').style.display = 'none';
      document.getElementById('startModal').style.display = 'none';

      // Activate AR mode
      activateAR();
  });

  // Listen for AR activation and display buttons
  modelViewer.addEventListener('ar-status', (event) => {
      if (event.detail.status === 'session-started') {
          document.getElementById('ar-buttons').style.display = 'block'; // Use JavaScript to show buttons
      }
  });

  // Toggle animation functionality
  document.getElementById('toggle-animation').addEventListener('change', function() {
      if (this.checked) {
          modelViewer.animationName = 'explode';
          modelViewer.play();
      } else {
          modelViewer.animationName = '';
          modelViewer.pause();
      }
  });

  // Change color functionality
  document.getElementById('change-color').addEventListener('click', function() {
      const material = modelViewer.model.materials[0];
      material.pbrMetallicRoughness.setBaseColorFactor([Math.random(), Math.random(), Math.random(), 1]);
  });
});


// Migrated Code //