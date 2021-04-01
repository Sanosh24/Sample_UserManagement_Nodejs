const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginUsageReportingDisabled } = require('apollo-server-core');

const schema = require('./schema');
const { tokenValidator, tokenExtract } = require('./lib/encryption');
require('./models').connect(process.env.DB_NAME);

const app = express();
app.use(cors());

const prodObj = {}
if (process.env.NODE_ENV !== 'development') {
    prodObj.introspection = true;
}

const apolloSetup = new ApolloServer({
    ...prodObj,
    schema,
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        let user = null;
        if (token) {
            const { status } = tokenValidator(token);
            if (status) {
                const { response } = await tokenExtract(token);
                user = response;
            }
        }
        return { user };
    },
    playground: {
        settings: {
            'editor.theme': 'dark', // light
        },
        tabs: [
            {
                endpoint: '/graphql'
            },
        ],
    },
    plugins: [ApolloServerPluginUsageReportingDisabled()]
});

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


apolloSetup.applyMiddleware({ app });

app.listen(process.env.PORT, process.env.HOST, () =>
    console.log(`🚀 Server ready at ${process.env.HOST}:${process.env.PORT}`)
);
