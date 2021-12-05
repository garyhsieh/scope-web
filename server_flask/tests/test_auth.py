import requests
from typing import Callable
from urllib.parse import urljoin

import scope.config


def test_auth(
    config_flask_client: scope.config.FlaskClientConfig,
    flask_session_unauthenticated_factory: Callable[[], requests.Session],
):
    session = flask_session_unauthenticated_factory()

    response = session.get(
        url=urljoin(
            config_flask_client.baseurl,
            "auth",
        ),
    )
    assert response.ok

    assert response.json() == {
        "status": 200,
        "name": "Luke Skywalker",
        "authToken": "my token",
    }