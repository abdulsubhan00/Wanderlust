
const allTags = [
    "Rooms",
    "Iconic Cities",
    "Hills",
    "Castles",
    "Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats"
];

const form = document.querySelector("#listing-form");

if (form) {
    const availableContainer = document.querySelector("#available-tags");
    const selectedContainer = document.querySelector("#selected-tags");
    const warning = document.querySelector("#tag-warning");
    const limitWarning = document.querySelector("#tag-limit-warning");
    const hiddenInputs = document.createElement("div");
    hiddenInputs.id = "tag-hidden-inputs";
    form.appendChild(hiddenInputs);

    let selectedTags = JSON.parse(form.dataset.selectedTags || "[]");

    function renderTags() {
        availableContainer.innerHTML = "";
        selectedContainer.innerHTML = "";
        hiddenInputs.innerHTML = "";

        // Available tags
        allTags.forEach(tag => {
            if (!selectedTags.includes(tag)) {
                const button = document.createElement("button");

                button.type = "button";
                button.className = "tag-btn available-tag";
                button.innerText = `+ ${tag}`;

                button.addEventListener("click", () => {
                    if (selectedTags.length >= 2) {
                        limitWarning.style.display = "block";
                        return;
                    }

                    selectedTags.push(tag);

                    warning.style.display = "none";
                    limitWarning.style.display = "none";

                    renderTags();
                });

                availableContainer.appendChild(button);
            }
        });

        // Selected tags
        selectedTags.forEach(tag => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "tag-btn selected-tag";
            button.innerText = `× ${tag}`;

            button.addEventListener("click", () => {
                selectedTags = selectedTags.filter(item => item !== tag);

                limitWarning.style.display = "none";

                renderTags();
            });

            selectedContainer.appendChild(button);

            // Hidden input to submit selected tags
            const hiddenInput = document.createElement("input");

            hiddenInput.type = "hidden";
            hiddenInput.name = "listing[tags][]";
            hiddenInput.value = tag;

            hiddenInputs.appendChild(hiddenInput);
        });
    }

    // Initial rendering (also loads existing tags in edit form)
    renderTags();

    // Form validation
    form.addEventListener("submit", (event) => {
        if (selectedTags.length < 1) {
            event.preventDefault();
            warning.style.display = "block";
        } else {
            warning.style.display = "none";
        }

        if (selectedTags.length > 2) {
            event.preventDefault();
            limitWarning.style.display = "block";
        }
    });
}
