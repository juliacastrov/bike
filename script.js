document.addEventListener('DOMContentLoaded', function() {
    const steps = Array.from(document.querySelectorAll('.step'));
    const nextButtons = document.querySelectorAll('.next-button');
    const backButtons = document.querySelectorAll('.back-button');
    const restartButton = document.getElementById('restartButton');
    const downloadMemoryButton = document.getElementById('downloadMemory');
    const downloadObservationButton = document.getElementById('downloadObservation');
    let currentStepIndex = 0;

    function showStep(index) {
        steps.forEach((step, i) => {
            step.style.display = i === index ? 'block' : 'none';
        });
        currentStepIndex = index;
    }

    nextButtons.forEach(button => button.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) showStep(currentStepIndex + 1);
    }));

    backButtons.forEach(button => button.addEventListener('click', () => {
        if (currentStepIndex > 0) showStep(currentStepIndex - 1);
    }));

    //restartButton.addEventListener('click', () => showStep(0));//

    // Download functionality remains unchanged
    function downloadCanvas(canvasId, filename) {
        const canvas = document.getElementById(canvasId);
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    downloadMemoryButton.addEventListener('click', () => downloadCanvas('canvasMemory', 'memoryDrawing.png'));
    downloadObservationButton.addEventListener('click', () => downloadCanvas('canvasObservation', 'observationDrawing.png'));

    initCanvasDrawing('canvasMemory');
    initCanvasDrawing('canvasObservation');
});

function initCanvasDrawing(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'black'; // Line color
    ctx.lineWidth = 2; // Adjust for smoother line
    ctx.lineJoin = 'round'; // Smooths the line join
    ctx.lineCap = 'round'; // Smooths the starting and ending points of the line

    let drawing = false;

    function startDrawing(e) {
        drawing = true;
        ctx.beginPath(); // Start a new path
        draw(e); // Begin drawing immediately to allow dot-like drawings
    }

    function draw(e) {
        if (!drawing) return;
        e.preventDefault(); // Prevent scrolling and other unwanted gestures

        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = (clientX - rect.left) * (canvas.width / rect.width);
        const y = (clientY - rect.top) * (canvas.height / rect.height);

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.moveTo(x, y); // Necessary to avoid dragging effect from last point to start
    }

    function stopDrawing() {
        if (drawing) {
            drawing = false;
            ctx.closePath(); // Close the path
        }
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);
    window.addEventListener('mouseup', stopDrawing);
    window.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}
