import fetch from 'node-fetch';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/graphql';

async function testWPGraphQL() {
  try {
    // Test basic query
    const response = await fetch(WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query TestQuery {
            posts {
              nodes {
                id
                title
                date
                content
              }
            }
            generalSettings {
              title
              description
            }
          }
        `,
      }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      throw new Error('GraphQL query failed');
    }

    console.log('WPGraphQL Test Results:');
    console.log('Site Title:', data.data.generalSettings.title);
    console.log('Site Description:', data.data.generalSettings.description);
    console.log('Number of Posts:', data.data.posts.nodes.length);
    
    return true;
  } catch (error) {
    console.error('Error testing WPGraphQL:', error);
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testWPGraphQL().then((success) => {
    if (!success) {
      process.exit(1);
    }
  });
}

export { testWPGraphQL }; 