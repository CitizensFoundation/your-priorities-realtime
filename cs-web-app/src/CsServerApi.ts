import { YpCodeBase } from './@yrpri/YpCodeBaseclass.js';
import { YpServerApi } from './YpServerApi.js';

export class CsServerApi extends YpServerApi {
  protected baseUrlPath = '/api';

  static transformCollectionTypeToApi(type: string): string {

    let transformedApiType;

    switch (type) {
      case "domain":
        transformedApiType = "domains";
        break;
      case "community":
        transformedApiType = "communities";
        break;
      case "group":
        transformedApiType = "groups";
        break;
      case "post":
        transformedApiType = "posts";
        break;
      case "user":
        transformedApiType = "users";
        break;
      default:
        transformedApiType ="";
        console.error(`Cant find collection type transsform for ${type}`);
    }

    return transformedApiType;
  }

   async fetchWrapper(url: string, options: RequestInit =  {}, showUserError = true) {
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json'
      }
    }
    const response = await fetch(url, options);
    return this.handleResponse(response, showUserError);
  }

  async handleResponse(response: Response, showUserError: boolean) {
    if (response.ok) {
      let responseJson = null;
      try {
        responseJson = await response.json();
      } catch (error) {
        if (response.status===200 && response.statusText==="OK") {
          // Do nothing
        } else {
          debugger;
          this.fireGlobal('yp-network-error', {
            response: response,
            jsonError: error,
            showUserError,
          });
        }
      }
      return responseJson;
    } else {
      debugger;
      this.fireGlobal('yp-network-error', {
        response: response,
        showUserError,
      });
      return null;
    }
  }

  public boot() {
    return this.fetchWrapper(this.baseUrlPath + '/domains');
  }

  public isloggedin() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/isloggedin'
    );
  }

  public postIssue(projectId: number, body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + `/projects/${projectId}/addIssue`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public postAction(issueId: number, body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + `/issues/${issueId}/addAction`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public postIssueComment(issueId: number, body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + `/issues/${issueId}/addComment`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public postParticipants(projectId: number, body: object) {
    return this.fetchWrapper(
      this.baseUrlPath + `/projects/${projectId}/addParticipants`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public voteAction(actionId: number, value: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/actions/${actionId}/vote`,
      {
        method: 'POST',
        body: JSON.stringify({
          value
        }),
      },
      false
    );
  }

  public voteIssue(issueId: number, value: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/issues/${issueId}/vote`,
      {
        method: 'POST',
        body: JSON.stringify({
          value
        }),
      },
      false
    );
  }


  public voteComment(commentId: number, value: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/comments/${commentId}/vote`,
      {
        method: 'PUT',
        body: JSON.stringify({
          value
        }),
      },
      false
    );
  }

  public login(userAvatar: string, userAvatarColor: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/login`,
      {
        method: 'POST',
        body: JSON.stringify({
          userAvatar,
          userAvatarColor
        }),
      },
      false
    );
  }

  public setSelectedStatus(issueId: number, checked: boolean) {
    return this.fetchWrapper(
      this.baseUrlPath + `/issues/${issueId}/setSelectedStatus`,
      {
        method: 'PUT',
        body: JSON.stringify({
          checked
        }),
      },
      false
    );
  }

  public logout() {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/logout`,
      {
        method: 'DELETE',
        body: JSON.stringify({
        }),
      },
      false
    );
  }

  checkLogin() {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/checkLogin`
    );
  }

  public rateIssue(issueId: number, roundId: number, value: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/issues/${issueId}/rate`,
      {
        method: 'POST',
        body: JSON.stringify({
          value,
          roundId
        }),
      },
      false
    );
  }

  getRatings(projectId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/projects/${projectId}/getRatings`
    );
  }

  getProject(projectId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/projects/${projectId}`
    );
  }

  getRound(roundId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/rounds/${roundId}`
    );
  }

  getMeeting(meetingId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/meetings/${meetingId}`
    );
  }

  getUserFromLoginToken(loginToken: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/${loginToken}/loginFromToken`
    );
  }

  getIssues(projectId: number, issueType: number | undefined) {
    return this.fetchWrapper(
      this.baseUrlPath + `/projects/${projectId}/issues/${issueType}`
    );
  }

  getSelectedIssues(projectId: number, issueType: number | undefined) {
    return this.fetchWrapper(
      this.baseUrlPath + `/projects/${projectId}/selectedIssues/${issueType}`
    );
  }

  getParticipants(projectId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/projects/${projectId}/participants`
    );
  }
}
