function buildPapers(result) {
    const accordion = document.getElementById('accordion');
    var index = 0;

    result.body.papers.forEach((paper) => {
        index++;
        const card = document.createElement('div');
        card.className = 'card';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.id = `heading${index}`;

        const titleButton = document.createElement('button');
        titleButton.className = 'btn btn-link collapsed title-left-align';
        titleButton.setAttribute('type', 'button');
        titleButton.setAttribute('data-bs-toggle', 'collapse');
        titleButton.setAttribute('data-bs-target', `#collapse${index}`);
        titleButton.setAttribute('aria-expanded', 'false');
        titleButton.setAttribute('aria-controls', `collapse${index}`);

        const badgeDate = document.createElement('div');
        badgeDate.className = 'badge badge-date';
        badgeDate.innerText = paper.date;

        const titleSpan = document.createElement('span');
        titleSpan.className = 'text-black-50';
        titleSpan.innerText = paper.title;

        titleButton.appendChild(badgeDate);
        titleButton.appendChild(titleSpan);

        cardHeader.appendChild(titleButton);

        const collapseDiv = document.createElement('div');
        collapseDiv.id = `collapse${index}`;
        collapseDiv.className = 'collapse';
        collapseDiv.setAttribute('aria-labelledby', `heading${index}`);
        collapseDiv.setAttribute('data-bs-parent', '#accordion');

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const navPills = document.createElement('ul');
        navPills.className = 'nav nav-pills mb-3';
        navPills.id = `pills-${index}`;

        const enNavItem = document.createElement('li');
        enNavItem.className = 'nav-item';

        const enNavLink = document.createElement('button');
        enNavLink.className = 'btn btn-light nav-link active';
        enNavLink.setAttribute('id', `pills-en-${index}`);
        enNavLink.setAttribute('type', 'button');
        enNavLink.setAttribute('data-bs-toggle', 'pill');
        enNavLink.setAttribute('data-bs-target', `#pills-en-${index}-tab`);
        enNavLink.setAttribute('role', 'tab');
        enNavLink.setAttribute('aria-controls', `pills-en-${index}`);
        enNavLink.setAttribute('aria-selected', 'true');
        enNavLink.innerText = 'English';

        enNavItem.appendChild(enNavLink);
        navPills.appendChild(enNavItem);

        const jpNavItem = document.createElement('li');
        jpNavItem.className = 'nav-item';

        const jpNavLink = document.createElement('button');
        jpNavLink.className = 'btn btn-light nav-link';
        jpNavLink.setAttribute('id', `pills-jp-${index}`);
        jpNavLink.setAttribute('type', 'button');
        jpNavLink.setAttribute('data-bs-toggle', 'pill');
        jpNavLink.setAttribute('data-bs-target', `#pills-jp-${index}-tab`);
        jpNavLink.setAttribute('role', 'tab');
        jpNavLink.setAttribute('aria-controls', `pills-jp-${index}`);
        jpNavLink.setAttribute('aria-selected', 'false');
        jpNavLink.innerText = '日本語';

        jpNavItem.appendChild(jpNavLink);
        navPills.appendChild(jpNavItem);

        const sourceLink = document.createElement('a');
        sourceLink.className = 'badge badge-link';
        sourceLink.href = "https://doi.org/" + paper.doi;
        sourceLink.target = '_blank';
        sourceLink.innerText = 'Source Link';

        const pdfLink = document.createElement('a');
        sourceLink.className = 'badge badge-link';
        sourceLink.href = paper.pdflink;
        sourceLink.target = '_blank';
        sourceLink.innerText = 'PDF File';

        const linkContainer = document.createElement('div');
        linkContainer.className = 'd-flex justify-content-between align-items-center';
        linkContainer.appendChild(navPills);

        // Create a wrapper div for the badges
        const badgesWrapper = document.createElement('div');

        badgesWrapper.appendChild(pdfLink);
        badgesWrapper.appendChild(sourceLink);

        linkContainer.appendChild(badgesWrapper);

        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = `pills-tabContent-${index}`;

        const enTabPane = document.createElement('div');
        enTabPane.className = 'tab-pane fade show active';
        enTabPane.id = `pills-en-${index}-tab`;
        enTabPane.setAttribute('role', 'tabpanel');
        enTabPane.setAttribute('aria-labelledby', `pills-en-${index}`);
        enTabPane.innerText = "English Summary"; //paper.enSum; CHANGE HERE

        const jpTabPane = document.createElement('div');
        jpTabPane.className = 'tab-pane fade';
        jpTabPane.id = `pills-jp-${index}-tab`;
        jpTabPane.setAttribute('role', 'tabpanel');
        jpTabPane.setAttribute('aria-labelledby', `pills-jp-${index}`);
        jpTabPane.innerText = "Japanese Summary"; //paper.jpSum; CHANGE HERE

        tabContent.appendChild(enTabPane);
        tabContent.appendChild(jpTabPane);

        cardBody.appendChild(linkContainer);
        cardBody.appendChild(tabContent);

        collapseDiv.appendChild(cardBody);

        card.appendChild(cardHeader);
        card.appendChild(collapseDiv);

        accordion.appendChild(card);
    });
}
