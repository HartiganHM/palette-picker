const getProjects = async () => {
  const fetchedProjects = await fetch('http://localhost:3000/api/v1/projects');
  const jsonProjects = await fetchedProjects.json();

  savedProjects = jsonProjects;
  renderProjectDropdown(savedProjects.projects);
}

const getPalettes = async () => {
  const fetchedPalettes = await fetch('http://localhost:3000/api/v1/palettes');
  const jsonPalettes = await fetchedPalettes.json();

  savedPalettes = jsonPalettes;
}

const postPalette = async (paletteObject, projectId) => {
  // const { name, color1, color2, color3, color4, color5 } = paletteObject;

  const fetchedEndpoint = await fetch(`http://localhost:3000/api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    body: JSON.stringify({ ...paletteObject }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  getPalettes();
}

const postProject = async projectName => {
  const fetchedEndpoint = await fetch('http://localhost:3000/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ name: projectName}),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const jsonResponse = fetchedEndpoint.json();
  getProjects();
}

let savedProjects;
let savedPalettes;

const colorsArray = [
  {
    class: '.color-1',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-2',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-3',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-4',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: '.color-5',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  }
];

const generateColors = colorArray => {
  const hexidecimalValues = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'A',
    'B',
    'C',
    'D',
    'E',
    'F'
  ];

  const colorValues = colorsArray.map(color => {
    let brightnessValue = 0;
    const hexValue = color.hexValue
      .split('')
      .map((element, index) => {
        const randomValue = Math.floor(Math.random() * 16);
        if (index === 0 || index === 2 || index === 4) {
          brightnessValue += randomValue;
        }
        return hexidecimalValues[randomValue];
      })
      .join('');

    brightnessValue <= 19
      ? (brightnessValue = '#FFF')
      : (brightnessValue = '#000');

    if (!color.locked) {
      color.value = `#${hexValue}`;
      color.brightnessValue = brightnessValue;
    }

    return color;
  });

  applyColors(colorValues);
};

const applyColors = colorValues => {
  colorValues.forEach(color => {
    const colorText = $(`${color.class}`).children()[1];
    const icon = $(`${color.class}`).children()[0];

    $(`${color.class}`).css('background-color', [color.value]);
    colorText.innerText = `${color.value}`;
    $(colorText).css('color', [color.brightnessValue]);
    $(icon).css('color', [color.brightnessValue]);
  });
};

const toggleLockIcon = event => {
  const element = event.target;
  let locked;

  if ($(element).hasClass('icon-lock-open')) {
    $(element)
      .removeClass('icon-lock-open')
      .addClass('icon-lock-closed');
    locked = true;
  } else {
    $(element)
      .removeClass('icon-lock-closed')
      .addClass('icon-lock-open');
    locked = false;
  }

  toggleColorLock(event, colorsArray, locked);
};

const toggleColorLock = (event, array, locked) => {
  const parentColorClass = '.' + $(event.target).parent()[0].classList[1];
  array.map(color => {
    if (color.class === parentColorClass) {
      color.locked = locked;
    }
    return color;
  });
};

const inputCheck = event => {
  event.preventDefault();
  const input = $(event.target).siblings()[0];
  const projectCheck = savedProjects.projects.filter(project => project.name === input.value)

  if (input.value === '') {
    input.placeholder = 'Please enter a title';
  } else if (projectCheck.length) {
    input.value = '';
    input.placeholder = 'Project already exists';
  } else {
    createNewProject(input);
  }
};

const createNewProject = title => {
    renderProject(title.value);
    postProject(title.value);
    title.value = '';
};

const renderProject = title => {
  $('.project').remove();
  $('.project-container').prepend(
    `
      <div class="project">
        <span class="project-name">${title}</span>

        <span class="palette-container">
          <span class="project-palette palette-placeholder">
            <span class="palette-name">No palettes</span>

            <span class="palette-color-group">
              <div class="saved-color"></div>
              <div class="saved-color"></div>
              <div class="saved-color"></div>
              <div class="saved-color"></div>
              <div class="saved-color"></div>
            </span>

            <i class="icon-trash trash-placeholder" disabled></i>
          </span>
        </span>
      </div>
    `
  );
};

const renderProjectDropdown = savedProjects => {
  $('.dropdown-placeholder').remove();

  savedProjects.forEach(project => {
    $('.project-selection').append(`
        <span class="dropdown-item">${project.name}</span>
      `);
  })
};

const toggleProjects = () => {
  $('.project-selection').toggleClass('hidden');
};

const selectProject = event => {
  const dropdownItem = $(event.target).closest('.dropdown-item');

  if (!dropdownItem[0]) {
    return;
  } else if ($(dropdownItem)[0].innerText === 'No Projects') {
    toggleProjects();
  } else if ($(dropdownItem)[0].innerText) {
    const selectedProject = savedProjects.projects.find(project => project.name === $(dropdownItem)[0].innerText);
    const selectedPalettes = savedPalettes.palettes.filter(palette => palette['project_id'] === selectedProject.id);

    toggleProjects();
    $('.project').remove();
    renderProject(selectedProject.name);
    renderPalettes(selectedPalettes);
  }
};

const savePalette = event => {
  event.preventDefault();

  const projectList = savedProjects.projects;
  const paletteInput = $('.save-palette-input')[0];

  if (projectList.length === 0) {
    alert('Please create a project');
  } else if (paletteInput.value === '') {
    paletteInput.placeholder = 'Please enter a palette name';
  } else {
    const projectDom = $('.project-name')[0].innerText;
    const selectedProject = projectList.find(project => project.name === projectDom);
    const currentPalette = colorsArray.map(color => color.value);
    console.log(selectedProject)

    if (!savedProjects[selectedProject]) {
      savedProjects[selectedProject] = [];
    }

    savedProjects[selectedProject][paletteName] = currentPalette;
    $('.save-palette-input')[0].value = '';
    renderPalettes(savedProjects[selectedProject]);
  }
};

const renderPalettes = palettes => {
  const renderedPalettes = palettes.forEach(palette => {
    $('.palette-placeholder').remove();
      $('.palette-container').prepend(
        `
          <span class="project-palette">
            <span class="palette-name">${palette.name}</span>
            <span class="palette-color-group">
              <div class="saved-color ${palette.name}-color1"></div>
              <div class="saved-color ${palette.name}-color2"></div>
              <div class="saved-color ${palette.name}-color3"></div>
              <div class="saved-color ${palette.name}-color4"></div>
              <div class="saved-color ${palette.name}-color5"></div>
            </span>
            <i class="icon-trash"></i>
          </span>
        `
      );
      $(`.${palette.name}-color1`).css('background-color', palette.color1);
      $(`.${palette.name}-color2`).css('background-color', palette.color2);
      $(`.${palette.name}-color3`).css('background-color', palette.color3);
      $(`.${palette.name}-color4`).css('background-color', palette.color4);
      $(`.${palette.name}-color5`).css('background-color', palette.color5);
  });
};

const deletePalette = event => {
  const deleteButton = $(event.target).closest('.icon-trash');

  if (!$(deleteButton).siblings()[0]) {
    return
  }

  const paletteName = $(deleteButton).siblings()[0].innerText;
  const projectName = $('.project-name')[0].innerText;

  delete savedProjects[projectName][paletteName];
  $(deleteButton.parent()).remove();

  if (Object.keys(savedProjects[projectName]).length === 0) {
    $('.palette-container').prepend(
      `
        <span class="project-palette palette-placeholder">
          <span class="palette-name">No palettes</span>

          <span class="palette-color-group">
            <div class="saved-color"></div>
            <div class="saved-color"></div>
            <div class="saved-color"></div>
            <div class="saved-color"></div>
            <div class="saved-color"></div>
          </span>

          <i class="icon-trash trash-placeholder" disabled></i>
        </span>
      `
    );
  }
};

$(document).ready(() => {
  getProjects();
  getPalettes();
  generateColors(colorsArray);
});
$(document).on('keydown', event => {
  if (event.keyCode === 32 && event.target === document.body) {
    event.preventDefault();
    generateColors();
  }
});
$('.generate-palette-button').click(colorsArray => generateColors(colorsArray));
$('.lock').on('click', event => toggleLockIcon(event));
$('.save-project-button').click(event => inputCheck(event));
$('.project-dropdown').click(toggleProjects);
$('.dropdown-wrapper').click(event => selectProject(event));
$('.save-palette-submit').click(event => savePalette(event));
$('.project-container').click(event => deletePalette(event));
$('.save-palette-input').keypress(event => {
  const regex = new RegExp('^[a-zA-Z0-9]+$');
  const input = String.fromCharCode(
    !event.charCode ? event.which : event.charCode
  );
  if (regex.test(input) || event.keyCode === 13 || event.keyCode === 32) {
    return true;
  }

  return false;
});
