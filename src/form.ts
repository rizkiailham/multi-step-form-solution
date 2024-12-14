interface FormData {
  firstName: string;
  lastName: string;
  age: number | string;
  phone: string;
  email: string;
  seat: string;
  food: string;
  allergies: string;
}

let formData: Partial<FormData> = {};


// Function to extract step number from the URL
function extractStepFromPath(): number {
  const path = window.location.pathname.replace('/', '').toLowerCase();
  if (path === 'results') return 4;
  const match = path.match(/step(\d+)/); // Match /step1, /step2, and so on.
  return match ? parseInt(match[1], 10) : 1; // Default to Step 1 if url is invalid
}

// Handle browser navigation (back/forward buttons)
window.onpopstate = (event) => {
  const step = event.state?.step || extractStepFromPath();
  renderStep(step);
};

// Initialize the app (check the URL when the page loads or reloads)
(function initializeApp() {
  const initialStep = extractStepFromPath();
  console.log('Initializing app with step:', initialStep);
  renderStep(initialStep); // Render based on step
})();


function updateURL(step: string) {
  const currentURL = new URL(window.location.href);
  currentURL.pathname = `/${step}`;
  history.pushState({ step }, '', currentURL.toString());
}

function renderStep(step: number) {
  const contentDiv = document.getElementById('content')!;
  contentDiv.innerHTML = ''; // Clear existing content

  switch (step) {
    case 1:
      contentDiv.innerHTML = `
        <form data-step="1">
          <h2 data-testid="title">Step 1</h2>
          <div>
            <input data-testid="firstName" name="firstName" type="text" placeholder="First Name" value="${formData.firstName || ''}" />
            <p class="error" data-testid="firstName-error"></p>
          </div>
          <div>
            <input data-testid="lastName" name="lastName" type="text" placeholder="Last Name" value="${formData.lastName || ''}" />
            <p class="error" data-testid="lastName-error"></p>
          </div>
          <div>
            <input data-testid="age" name="age" type="number" placeholder="Age" value="${formData.age || ''}" />
            <p class="error" data-testid="age-error"></p>
          </div>
          <button type="button" data-testid="submit">Next</button>
        </form>`
      break;

    case 2:
      contentDiv.innerHTML = `
        <form data-step="2">
          <h2 data-testid="title">Step 2</h2>
          <div>
            <input data-testid="phone" name="phone" type="text" placeholder="Phone" value="${formData.phone || ''}" />
            <p class="error" data-testid="phone-error"></p>
          </div>
          <div>
            <input data-testid="email" name="email" type="email" placeholder="Email" value="${formData.email || ''}" />
            <p class="error" data-testid="email-error"></p>
          </div>
          <div class="button-group">
            <button type="button" data-testid="back">Back</button>
            <button type="button" data-testid="submit">Next</button>
          </div>
        </form>`
      break;

    case 3:
      contentDiv.innerHTML = `
        <form data-step="3">
          <h2 data-testid="title">Step 3</h2>
          <div>
            <input data-testid="seat" name="seat" type="text" placeholder="Seat" value="${formData.seat || ''}" />
            <p class="error" data-testid="seat-error"></p>
          </div>
          <div>
            <input data-testid="food" name="food" type="text" placeholder="Food" value="${formData.food || ''}" />
            <p class="error" data-testid="food-error"></p>
          </div>
          <div>
            <input data-testid="allergies" name="allergies" type="text" placeholder="Allergies" value="${formData.allergies || ''}" />
            <p class="error" data-testid="allergies-error"></p>
          </div>
          <div class="button-group">
            <button type="button" data-testid="back">Back</button>
            <button type="button" data-testid="submit">Submit</button>
          </div>
        </form>`
      break;

    case 4:
      const resultsHTML = Object.keys(formData)
        .map(
          (key) =>`
            <div>
                <strong>${key}:</strong>
                <span data-testid="${key}">${formData[key as keyof FormData] || 'Not provided'}</span>
            </div>`
        )
        .join('');
      contentDiv.innerHTML = `
        <div>
          <h2>Results</h2>
          ${resultsHTML}
          <button type="button" data-testid="back">Back</button>
        </div>`
      break;

    default:
      contentDiv.innerHTML = `<h2>Invalid step</h2>`;
  }

  // Attach event listeners
  attachListeners(step);
}

function attachListeners(step: number) {
  const nextButtons = document.querySelectorAll('[data-testid="submit"]');
  const backButtons = document.querySelectorAll('[data-testid="back"]');

  nextButtons.forEach((nextButton) => {
    nextButton.addEventListener('click', () => {
      if (validateStep(step)) {
        if (step === 3) {
          updateURL('results');
          renderStep(4);
        } else {
          updateURL(`step${step + 1}`);
          renderStep(step + 1);
        }
      }
    });
  });

  backButtons.forEach((backButton) => {
    backButton.addEventListener('click', () => {
      if (step > 1) {
        updateURL(`step${step - 1}`);
        renderStep(step - 1);
      }
    });
  });

  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) =>
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      formData[target.name as keyof FormData] = target.value as any;
    })
  );
}

function validateStep(step: number): boolean {
  let isValid = true;
  const errors: Record<string, string> = {};

  if (step === 1) {
    const { firstName, lastName, age } = formData;

    if (!firstName) {
      isValid = false;
      errors.firstName = "First name is a required field";
    } else if (/\d/.test(firstName)) {
      isValid = false;
      errors.firstName = "First name should not contain numbers";
    }

    if (!lastName) {
      isValid = false;
      errors.lastName = "Last name is a required field";
    } else if (/\d/.test(lastName)) {
      isValid = false;
      errors.lastName = "Last name should not contain numbers";
    }

    if (!age) {
      isValid = false;
      errors.age = "Age must be a number";
    } else if (isNaN(Number(age))) {
      isValid = false;
      errors.age = "Age must be a number";
    } else if (Number(age) <= 0) {
      isValid = false;
      errors.age = "Age should be positive";
    }
  } else if (step === 2) {
    const { phone, email } = formData;

    if (!phone) {
      isValid = false;
      errors.phone = "Phone number is a required field";
    }

    if (!email) {
      isValid = false;
      errors.email = "Email is a required field";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      errors.email = "Email should have correct format";
    }
  } else if (step === 3) {
    const { seat, food, allergies } = formData;

    if (!seat) {
      isValid = false;
      errors.seat = "Seat is required";
    }

    if (!food) {
      isValid = false;
      errors.food = "Food is required";
    }

    if (!allergies) {
      isValid = false;
      errors.allergies = "Allergies is required";
    }
  }

  displayErrors(errors);

  return isValid;
}


function displayErrors(errors: Record<string, string>) {
  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach((field) => (field.textContent = ''));

  Object.entries(errors).forEach(([field, message]) => {
    const errorElement = document.querySelector(`[data-testid="${field}-error"]`);
    if (errorElement) errorElement.textContent = message;
  });
}