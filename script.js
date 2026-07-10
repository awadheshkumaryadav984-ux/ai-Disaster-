document.addEventListener("DOMContentLoaded", function () {

    const analyzeBtn = document.getElementById("analyzeBtn");
    const imageInput = document.getElementById("imageUpload");
    const result = document.getElementById("result");
    const dashboard = document.getElementById("dashboard");
    const preview = document.getElementById("previewImage");

    analyzeBtn.addEventListener("click", async function () {

        if (imageInput.files.length === 0) {
            result.innerHTML = "⚠ Please upload an image.";
            return;
        }

        preview.src = URL.createObjectURL(imageInput.files[0]);
        preview.style.display = "block";

        result.innerHTML = "🤖 AI is analyzing the image...";
        dashboard.style.display = "none";

        const formData = new FormData();
        formData.append("image", imageInput.files[0]);

        try {

            const response = await fetch("https://ai-disaster-7.onrender.com/analyze", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (!data.success) {
                result.innerHTML = "❌ " + data.message;
                return;
            }

            let ai;

            try {
                ai = JSON.parse(data.result);
            } catch (e) {
                result.innerHTML = data.result;
                return;
            }

            dashboard.style.display = "block";
            result.innerHTML = "";

            document.getElementById("disasterType").innerHTML = ai.disaster_type;
            document.getElementById("severity").innerHTML = ai.severity;
            document.getElementById("confidence").innerHTML = ai.confidence;
            document.getElementById("summary").innerHTML = ai.summary;

            document.getElementById("actions").innerHTML =
                ai.immediate_actions.map(item => `<li>${item}</li>`).join("");

            document.getElementById("tips").innerHTML =
                ai.safety_tips.map(item => `<li>${item}</li>`).join("");

            document.getElementById("contacts").innerHTML =
                ai.recommended_contacts.map(item => `<li>${item}</li>`).join("");

            document.getElementById("equipment").innerHTML =
                ai.equipment_needed.map(item => `<li>${item}</li>`).join("");

        } catch (error) {
            console.error(error);
            result.innerHTML = "❌ Unable to connect to AI backend.";
        }

    });

    document.getElementById("locationBtn").addEventListener("click", function () {

        if (!navigator.geolocation) {
            alert("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(showLocation, showError);

    });

    function showLocation(position) {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        document.getElementById("locationText").innerHTML =
            "Latitude: " + lat + "<br>Longitude: " + lng;

        const map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: lat, lng: lng },
            zoom: 15
        });

        new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            title: "Your Location"
        });

    }

    function showError(error) {

        switch (error.code) {

            case error.PERMISSION_DENIED:
                document.getElementById("locationText").innerHTML =
                    "❌ Location permission denied.";
                break;

            case error.POSITION_UNAVAILABLE:
                document.getElementById("locationText").innerHTML =
                    "❌ Location unavailable.";
                break;

            case error.TIMEOUT:
                document.getElementById("locationText").innerHTML =
                    "❌ Location request timed out.";
                break;

            default:
                document.getElementById("locationText").innerHTML =
                    "❌ Unable to detect location.";
        }

    }

});
