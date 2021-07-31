

(() => {
  var App = {
    htmlElements: {

      userForm: document.getElementById("user_form"),
      userList: document.getElementById("user_list"),


    },

    init: () => {

      App.bindEvents();
      App.initializeData.get_users();

    },

    bindEvents: () => {

      App.htmlElements.userForm.addEventListener("submit", App.events.onUserFormSubmit);
      App.htmlElements.userList.addEventListener("click", App.events.update_or_delete_user);

    },

    initializeData: {

      get_users: async () => {

        const { count, data } = await App.endpoints.getUsers();

        data.forEach((user) => {
          App.utils.addUserToTable(user);
        });

      },

      post_user: async (payload) => {

        await App.endpoints.postUser(payload);
        location.reload();

      },

      update_user: async (id, payload) => {

        await App.endpoints.updateUser(id, payload);
        location.reload();

      },

      delete_user: async (id) => {

        await App.endpoints.deleteUser(id);
        location.reload();

      },

    },

    events: {

      onUserFormSubmit: (e) => {
        
        e.preventDefault();
        const { name, age, status } = e.target.elements;

        var payload = {
          id: id.value,
          name: name.value,
          age: age.value,
          status: status.value
        };

        App.initializeData.post_user(payload);

      },

      update_or_delete_user: (e) => {

        if (!e.target) { return; }
        if (e.target.className === 'update_user') {

          if (App.htmlElements.userForm.elements.name.value !== '') {

            var id = App.htmlElements.userForm.elements.id.value;

            var payload = {

              name: App.htmlElements.userForm.elements.name.value,
              age: App.htmlElements.userForm.elements.age.value,
              status: App.htmlElements.userForm.elements.status.value

            };

            App.initializeData.update_user(id, payload);

          }
          else {

            App.htmlElements.userForm.elements.id.value = e.target.value;

          }

        }
        else if (e.target.className === 'delete_user') {

          console.log('id', e.target.value);
          App.initializeData.delete_user(e.target.value);

        }
      }

    },

    endpoints: {

      getUsers: () => {

        return App.utils.fetch("http://localhost:3000/api/v1/users/", "GET");

      },

      postUser: (payload) => {

        return App.utils.post_or_update(
          "http://localhost:3000/api/v1/user/",
          "POST",
          payload
        );

      },

      updateUser: (id, payload) => {

        return App.utils.post_or_update(
          "http://localhost:3000/api/v1/user/" + id,
          "PUT",
          payload
        );

      },

      deleteUser: (id) => {

        return App.utils.delete(
          "http://localhost:3000/api/v1/user/",
          id,
          "DELETE"
        );

      },

    },

    utils: {

      delete: async (url, id, method) => {

        const response = await fetch(url + id, { method });
        return response.json();

      },

      post_or_update: async (url, method, payload) => {

        const response = await fetch(url, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        return response.json();

      },

      fetch: async (url, method, payload) => {

        const requestOptions = { method };
        const response = await fetch(url, requestOptions);
        return response.json();

      },

      addUserToTable: ({ id, name, age, status }) => {

App.htmlElements.userList.innerHTML += `<tr>  <td id="user_id"> ${id} </td>  
                                        <td id="user_name"> ${name} </td> 
                                        <td> ${age} </td> <td> ${status} </td> 
                                        <td> <button class="update_user" value="${id}"> actualizar </button> </td>
                                        <td> <button class="delete_user" value="${id}"> delete </button> </td> 
                                  </tr>`;

      },

    },
  };
  App.init();
})();
