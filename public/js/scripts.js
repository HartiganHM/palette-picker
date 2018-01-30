const getProjects = async () => {
  try {
    const fetchedProjects = await fetch('/api/v1/projects');
    const jsonProjects = await fetchedProjects.json();

    savedProjects = jsonProjects;

    if(jsonProjects.projects.length) {
      renderProjectDropdown(savedProjects.projects)
    }

  } catch (error) {
    return new Error(`Error fetching projects: ${error}`);
  }
}

const getPalettes = async () => {
  try {
    const fetchedPalettes = await fetch('/api/v1/palettes');
    const jsonPalettes = await fetchedPalettes.json();

    savedPalettes = jsonPalettes;
    if($('.project-name').length) {
      renderPalettes(savedPalettes.palettes)
    }
  } catch (error) {
    return new Error(`Error fetching palettes: ${error}`);
  }
}


const postProject = async projectName => {
  try {
    const fetchedEndpoint = await fetch('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify({ name: projectName}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const jsonResponse = fetchedEndpoint.json();
    getProjects();
  } catch (error) {
    return new Error(`Error posting project: ${error}`);
  }
}

const postPalette = async (paletteObject, projectId) => {
  try {
    const { name, color1, color2, color3, color4, color5 } = paletteObject;

    const fetchedEndpoint = await fetch(`/api/v1/projects/${projectId}/palettes`, {
      method: 'POST',
      body: JSON.stringify({ ...paletteObject }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    getPalettes();
  } catch (error) {
    return new Error(`Error posting palette: ${error}`);
  }
}

const deleteProject = async projectId => {
  try {
    const fetchedDelete = await fetch(`/api/v1/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    getProjects();
  } catch (error) {
    return new Error(`Error deleting project: ${error}`);
  }
}

const deletePalette = async paletteId => {
  try {
    const fetchedDelete = await fetch(`/api/v1/palettes/${paletteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Error(`Error deleting palette: ${error}`);
  }
}

let savedProjects;
let savedPalettes;

const colorsArray = [
  {
    class: 'color1',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: 'color2',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: 'color3',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: 'color4',
    hexValue: '000000',
    brightnessValue: '#FFF',
    locked: false
  },
  {
    class: 'color5',
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
    const colorText = $(`.${color.class}`).children()[1];
    const icon = $(`.${color.class}`).children()[0];

    $(`.${color.class}`).css('background-color', [color.value]);
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
    const colorClass = '.' + color.class;

    if (colorClass === parentColorClass) {
      color.locked = locked;
    }
    return color;
  });
};

const inputCheck = event => {
  event.preventDefault();
  const input = $('.new-project-input')[0];
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
        <span class="project-name">${title}<i id="remove-project" class="icon-trash"></i></span>

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
  $('.dropdown-item').remove();

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
    paletteLengthCheck()
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
  } else if ($('.project-name').length === 0) {
    alert('Please select a project to save this palette to');
  } else {
    const projectDom = $('.project-name')[0].innerText;
    const selectedProject = savedProjects.projects.find(project => project.name === projectDom);

    const currentPalette = colorsArray.reduce((currentPalette, color, index) => {
      const colorNumber = 'color' + (index + 1);
      currentPalette[colorNumber] = color.value;

      return currentPalette;
    }, {});

    const paletteObject = Object.assign({}, currentPalette, { name: paletteInput.value })

    $('.save-palette-input')[0].value = '';
    postPalette(paletteObject, selectedProject.id)
  }
};

const renderPalettes = palettes => {
  const selectedProject = savedProjects.projects.find(project => project.name === $('.project-name')[0].innerText);
  const selectedPalettes = palettes.filter(palette => palette['project_id'] === selectedProject.id);

  $('.project-palette').remove();
  const renderedPalettes = selectedPalettes.forEach(palette => {
    $('.palette-placeholder').remove();
      $('.palette-container').prepend(
        `
          <span class="project-palette">
            <span class ="palette-header">
              <span class="palette-name">${palette.name}</span>
            </span>

            <span class="palette-color-group ${palette.id}">
              <svg class="saved-color" viewBox="0 0 404 519">
                <g id="glass">
                  <path class="glass" d="M58.5,507.5h293c0,0,28-5,38-18s0-48,0-48l-127-237l-1-160c0,0,11-7,11-16s-1-17-10-17s-121,0-121,0s-8,0-8,14
                    s8,20,8,20v161l-129,242c0,0-10,26,4,42S58.5,507.5,58.5,507.5z"/>
                </g>
                <g id="liquid">
                  <path class="${palette.id}-color1" d="M140,267L51,432c0,0-8,25,0,34s19,18,39,18s237,0,237,0s20-3,30-14s8-29,4-36s-93-175-93-175s-3-16-17-15
                    s-16,15-34,18c0,0-13,11-36,12S145,257,140,267z"/>
                </g>
                <g id="bubbles">
                  <circle class="bubbles" cx="155" cy="348" r="17"/>
                  <circle class="bubbles" cx="185" cy="383" r="30"/>
                  <circle class="bubbles" cx="230" cy="316" r="10"/>
                </g>
              </svg>

              <svg class="saved-color" viewBox="0 0 404 519">
                <g id="glass">
                  <path class="glass" d="M58.5,507.5h293c0,0,28-5,38-18s0-48,0-48l-127-237l-1-160c0,0,11-7,11-16s-1-17-10-17s-121,0-121,0s-8,0-8,14
                    s8,20,8,20v161l-129,242c0,0-10,26,4,42S58.5,507.5,58.5,507.5z"/>
                </g>
                <g id="liquid">
                  <path class="${palette.id}-color2" d="M140,267L51,432c0,0-8,25,0,34s19,18,39,18s237,0,237,0s20-3,30-14s8-29,4-36s-93-175-93-175s-3-16-17-15
                    s-16,15-34,18c0,0-13,11-36,12S145,257,140,267z"/>
                </g>
                <g id="bubbles">
                  <circle class="bubbles" cx="155" cy="348" r="17"/>
                  <circle class="bubbles" cx="185" cy="383" r="30"/>
                  <circle class="bubbles" cx="230" cy="316" r="10"/>
                </g>
              </svg>

              <svg class="saved-color" viewBox="0 0 404 519">
                <g id="glass">
                  <path class="glass" d="M58.5,507.5h293c0,0,28-5,38-18s0-48,0-48l-127-237l-1-160c0,0,11-7,11-16s-1-17-10-17s-121,0-121,0s-8,0-8,14
                    s8,20,8,20v161l-129,242c0,0-10,26,4,42S58.5,507.5,58.5,507.5z"/>
                </g>
                <g id="liquid">
                  <path class="${palette.id}-color3" d="M140,267L51,432c0,0-8,25,0,34s19,18,39,18s237,0,237,0s20-3,30-14s8-29,4-36s-93-175-93-175s-3-16-17-15
                    s-16,15-34,18c0,0-13,11-36,12S145,257,140,267z"/>
                </g>
                <g id="bubbles">
                  <circle class="bubbles" cx="155" cy="348" r="17"/>
                  <circle class="bubbles" cx="185" cy="383" r="30"/>
                  <circle class="bubbles" cx="230" cy="316" r="10"/>
                </g>
              </svg>

              <svg class="saved-color" viewBox="0 0 404 519">
                <g id="glass">
                  <path class="glass" d="M58.5,507.5h293c0,0,28-5,38-18s0-48,0-48l-127-237l-1-160c0,0,11-7,11-16s-1-17-10-17s-121,0-121,0s-8,0-8,14
                    s8,20,8,20v161l-129,242c0,0-10,26,4,42S58.5,507.5,58.5,507.5z"/>
                </g>
                <g id="liquid">
                  <path class="${palette.id}-color4" d="M140,267L51,432c0,0-8,25,0,34s19,18,39,18s237,0,237,0s20-3,30-14s8-29,4-36s-93-175-93-175s-3-16-17-15
                    s-16,15-34,18c0,0-13,11-36,12S145,257,140,267z"/>
                </g>
                <g id="bubbles">
                  <circle class="bubbles" cx="155" cy="348" r="17"/>
                  <circle class="bubbles" cx="185" cy="383" r="30"/>
                  <circle class="bubbles" cx="230" cy="316" r="10"/>
                </g>
              </svg>

              <svg class="saved-color" viewBox="0 0 404 519">
                <g id="glass">
                  <path class="glass" d="M58.5,507.5h293c0,0,28-5,38-18s0-48,0-48l-127-237l-1-160c0,0,11-7,11-16s-1-17-10-17s-121,0-121,0s-8,0-8,14
                    s8,20,8,20v161l-129,242c0,0-10,26,4,42S58.5,507.5,58.5,507.5z"/>
                </g>
                <g id="liquid">
                  <path class="${palette.id}-color" d="M140,267L51,432c0,0-8,25,0,34s19,18,39,18s237,0,237,0s20-3,30-14s8-29,4-36s-93-175-93-175s-3-16-17-15
                    s-16,15-34,18c0,0-13,11-36,12S145,257,140,267z"/>
                </g>
                <g id="bubbles">
                  <circle class="bubbles" cx="155" cy="348" r="17"/>
                  <circle class="bubbles" cx="185" cy="383" r="30"/>
                  <circle class="bubbles" cx="230" cy="316" r="10"/>
                </g>
              </svg>

              <i class="icon-trash"></i>
            </span>
          </span>
        `
      );
      $(`.${palette.id}-color1`).css('fill', palette.color1);
      $(`.${palette.id}-color2`).css('fill', palette.color2);
      $(`.${palette.id}-color3`).css('fill', palette.color3);
      $(`.${palette.id}-color4`).css('fill', palette.color4);
      $(`.${palette.id}-color5`).css('fill', palette.color5);
  });
};

const removePalette = event => {
  const deleteButton = $(event.target).closest('.icon-trash');

  if (!$(deleteButton).siblings()[0]) {
    return
  }

  const paletteName = $(deleteButton).parent().siblings('.palette-header')[0].children[0].innerText;
  const selectedPalette = savedPalettes.palettes.find(palette => palette.name === paletteName);

  deletePalette(selectedPalette.id);
  $(deleteButton).closest('.project-palette').remove();
  paletteLengthCheck();
};

const removeProject = event => {
  const deleteButton = $(event.target).closest('#remove-project');

  if (!deleteButton.length) {
    return
  }

  const projectName = $(deleteButton)[0].parentElement.innerText;
  const selectedProject = savedProjects.projects.find(project => project.name === projectName);

  deleteProject(selectedProject.id);
  $('.project').remove();
}

const paletteLengthCheck = () => {
  const currentProjectPalettes = $('.project-palette');

  if (!currentProjectPalettes.length) {
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
}

const setPaletteColors = event => {
  if($(event.target).closest('.palette-color-group').length === 0) {
    return
  }

  const colorPaletteGroupId = JSON.parse($(event.target).closest('.palette-color-group')[0].classList[1]);
  const selectedPalette = savedPalettes.palettes.find(palette => palette.id === colorPaletteGroupId);

  colorsArray.forEach(color => {
    const colorText = $(`.${color.class}`).children()[1];
    const icon = $(`.${color.class}`).children()[0];

    $(`.${color.class}`).css('background-color', selectedPalette[color.class]);
    colorText.innerText = `${selectedPalette[color.class]}`;
  })
}

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
$('.project-container').click(event => removePalette(event));
$('.project-container').click(event => removeProject(event));
$('.project-container').click(event => setPaletteColors(event));
