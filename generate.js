const axios = require('axios');
const fs = require('fs');

const fetchMediumArticles = async (username, limit, responseType) => {
    const response = await axios.get(`https://nodejs-medium-fetcher.vercel.app/?username=${username}&limit=${limit}&responseType=${responseType}`);
    const { data, status } = response;
    return status === 200 ? data : [];
};

const generateMarkdown = async (username, limit, responseType) => {
    const posts = await fetchMediumArticles(username, limit, responseType);

    let markdown = `## Latest Articles\n\n`;
    posts.forEach((post, index) => {
        markdown += `${index + 1}. [${post.title}](${post.link})\n`;
    });

    markdown += `\n_Last updated: ${
        new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
    }_`;

    return markdown;
}

const updateReadme = async (data) => {
    if (!data) {
        console.log('No data to update README.md');
        return;
    }

    const existingReadme = fs.readFileSync('README.md', 'utf-8');
    if (!existingReadme) {
        console.log('README.md not found');
        return;
    }

    // Pattern:: <!--MEDIUM-ARTICLES-START--> ... <!--MEDIUM-ARTICLES-END-->
    const regex = /<!--MEDIUM-ARTICLES-START-->[\s\S]*<!--MEDIUM-ARTICLES-END-->/;
    const replacement = `<!--MEDIUM-ARTICLES-START-->\n${data}\n<!--MEDIUM-ARTICLES-END-->`;

    const newReadme = existingReadme.replace(regex, replacement);
    fs.writeFileSync('README.md', newReadme);

    console.log('README.md updated successfully');
}

(async () => {
    const markdown = await generateMarkdown('atakde', 5, 'json');
    await updateReadme(markdown);
})();
