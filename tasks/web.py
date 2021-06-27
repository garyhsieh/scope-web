"""
Tasks for the web client.

These are intentionally thin wrappers around `scripts`,
because those scripts will be executed in a production environment that does not include Python.
"""

from invoke import Collection
from invoke import task


@task
def dev(context):
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
def prod_build(context):
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
def prod_serve(context):
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


# Build task collection
ns = Collection()

ns.add_task(dev, name='dev')

ns_prod = Collection()
ns_prod.add_task(prod_build, 'build')
ns_prod.add_task(prod_serve, 'serve')

ns.add_collection(ns_prod, 'prod')
