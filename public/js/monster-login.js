
(() => {
    const eyes = document.querySelectorAll(".svg-eye");

    if (!eyes.length) return;

    const pupils = [...eyes].map((eye) => {
        const pupil = eye.querySelector(".svg-pupil");

        return {
            pupil,
            cx: Number(pupil.getAttribute("cx")),
            cy: Number(pupil.getAttribute("cy")),
            maxMove: 7
        };
    });

    function moveEyes(event) {
        for (const { pupil, cx, cy, maxMove } of pupils) {
            const eye = pupil.parentElement;
            const rect = eye.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;
            const angle = Math.atan2(dy, dx);

            const distance = Math.min(
                Math.hypot(dx, dy) / 8,
                maxMove
            );

            pupil.setAttribute(
                "cx",
                cx + Math.cos(angle) * distance
            );

            pupil.setAttribute(
                "cy",
                cy + Math.sin(angle) * distance
            );
        }
    }

    function resetEyes() {
        for (const { pupil, cx, cy } of pupils) {
            pupil.setAttribute("cx", cx);
            pupil.setAttribute("cy", cy);
        }
    }

    window.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "touch") {
            moveEyes(event);
        }
    }, { passive: true });

    window.addEventListener("blur", resetEyes);
    document.addEventListener("pointerleave", resetEyes);

    // Close mascot eyes when password field is focused
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    passwordInputs.forEach((input) => {

        input.addEventListener("focus", () => {
            document.body.classList.add("password-focused");
        });

        input.addEventListener("blur", () => {
            document.body.classList.remove("password-focused");
        });

    });
})();
