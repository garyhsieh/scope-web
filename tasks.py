import aws_infrastructure.task_templates.config
from invoke import Collection
from invoke import task
from pathlib import Path

# Build our task collection
ns = Collection()

# Tasks for Invoke configuration
ns_config = aws_infrastructure.task_templates.config.create_tasks()
ns.add_collection(ns_config)
ns.configure(ns_config.configuration())

#
# Tasks for the web client
#


@task
def web_dev(context):
    """
    Start a development build of the client, listening on `localhost:3000`, including hot reloading.

    Builds according to 'config/webpack.dev.js'.
    """

    context.run(
        command=' '.join([
            'yarn',
            'web_dev',
        ])
    )


@task
def web_prod_build(context):
    """
    Build a production bundle of the client.

    Builds according to 'config/webpack.prod.js', including hot reloading.

    Is a thin wrapper around `scripts/web_prod_build.js`,
    because that script will be executed in a production environment that does not include Python.
    """

    context.run(
        command=' '.join([
            'yarn',
            'web_prod_build',
        ])
    )


@task
def web_prod_serve(context):
    """
    Serve a production bundle of the client, listening on `0.0.0.0:3000`.

    Is a thin wrapper around `scripts/web_prod_serve.js`,
    because that script will be executed in a production environment that does not include Python.
    """

    context.run(
        command=' '.join([
            'yarn',
            'web_prod_serve',
        ])
    )


ns_web = Collection('web')

ns_web.add_task(web_dev, name='dev')

ns_web_prod = Collection('prod')
ns_web_prod.add_task(web_prod_build, name='build')
ns_web_prod.add_task(web_prod_serve, name='serve')
ns_web.add_collection(ns_web_prod)

ns.add_collection(ns_web)

#
# Tasks for the Flask server
#


@task
def flask_dev(context):
    """
    Start a development build of Flask, listening on `localhost:4000`, including hot reloading.
    """

    with context.cd(Path('server', 'flask')):
        context.run(
            command=' '.join([
                'flask',
                'run',
            ]),
            env={
                'FLASK_ENV': 'development',
                'FLASK_RUN_HOST': 'localhost',
                'FLASK_RUN_PORT': '4000',
            }
        )


@task
def flask_prod(context):
    """
    Start a production build of Flask, listening on `0.0.0.0:4000`.
    """

    with context.cd(Path('server', 'flask')):
        context.run(
            command=' '.join([
                'waitress-serve',
                '--port=4000',
                '--call "app:create_app"'
            ]),
            env={
                'FLASK_ENV': 'production'
            }
        )


ns_flask = Collection('flask')

ns_flask.add_task(flask_dev, name='dev')
ns_flask.add_task(flask_prod, name='prod')

ns.add_collection(ns_flask)
