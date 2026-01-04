window.releaseFund = function(appId) {
    let allApplications = JSON.parse(localStorage.getItem('applications')) || [];
    let fundReleases = JSON.parse(localStorage.getItem('fundReleases')) || [];

    const index = allApplications.findIndex(app => app.appId === appId);

    if (index === -1) return;

    const app = allApplications[index];

    if (app.status === "Fund Released") {
        alert("Funds already released for this student.");
        return;
    }

    app.status = "Fund Released";
    app.fundReleasedDate = new Date().toLocaleDateString();

    fundReleases.push({
        releaseId: "FR-" + Date.now(),
        appId: app.appId,
        studentEmail: app.email,
        scholarshipName: app.scholarshipName,
        message: "Your scholarship funds have been released. Please coordinate with the finance office.",
        date: app.fundReleasedDate
    });

    localStorage.setItem('applications', JSON.stringify(allApplications));
    localStorage.setItem('fundReleases', JSON.stringify(fundReleases));

    alert(`Funds successfully released for ${app.firstName} ${app.lastName}`);
    renderApplications();
};
