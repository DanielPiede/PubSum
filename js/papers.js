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

        const linkContainer = document.createElement('div');
        linkContainer.className = 'd-flex justify-content-between align-items-center';

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'd-flex align-items-center';

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

        buttonWrapper.appendChild(navPills);

        const badgesContainer = document.createElement('div');
        badgesContainer.className = 'badges-container';

        const pmcidBadge = document.createElement('a');
        pmcidBadge.className = 'badge pmcid-badge';
        pmcidBadge.href = "https://www.ncbi.nlm.nih.gov/pmc/articles/" + paper.pmcid;
        pmcidBadge.innerText = 'PMCID';
        pmcidBadge.target = "_blank";
        pmcidBadge.title = paper.pmcid;
        
        const doiBadge = document.createElement('a');
        doiBadge.className = 'badge doi-badge';
        doiBadge.href = "https://www.doi.org/" + paper.doi;
        doiBadge.innerText = 'DOI';
        doiBadge.target = '_blank';
        doiBadge.title = paper.doi;
        
        const pdfBadge = document.createElement('a');
        pdfBadge.className = 'badge pdf-badge';
        pdfBadge.href = "https://www.ncbi.nlm.nih.gov/pmc/articles/" + paper.pmcid + "/pdf";
        pdfBadge.target = "_blank";
        pdfBadge.innerText = 'PDF';
        
        badgesContainer.appendChild(pmcidBadge);
        badgesContainer.appendChild(doiBadge);
        badgesContainer.appendChild(pdfBadge);

        linkContainer.appendChild(buttonWrapper);
        linkContainer.appendChild(badgesContainer);

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
