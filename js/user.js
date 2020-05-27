
function print_albums_table(data) {
    let table = `
            <table class="table table-dark" style="width:90%">
                 <thead>
                      <tr>
                          <th scope="col">#</th>
                          <th scope="col">Album Name</th>
                          <th scope="col">Album Type</th>
                          <th scope="col">Links</th>
                      </tr>
                 </thead>
                 <tbody>`;
    for (i = 0; i < data.length; i++) {
        table += `<tr>
                     <td scope="row">${i + 1}</th>
                     <td scope="row">${data[i][1]}</th>
                     <td>${data[i][2]}</td>  
                     <td>
                     <div class="btn-group" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-secondary" id= "${data[i][0]}-${i + 1}" onclick="view_pictuers(${data[i]})">View pictures</button>
                            <button type="button" class="btn btn-secondary" id= "${data[i][0]}-${i + 2}" onclick="add_picture(${data[i]})">Add picture</button>
                            <button type="button" class="btn btn-secondary" id= "${data[i][0]}-${i + 3}" onclick="delete_album(${data[i][0]})">Delete Album</button>
                    </div>
                     </td>     
                  </tr>`;
    }
    table += ` </tbody>
                      </table>`;
    $("#table").replaceWith(`<div id="album_table">${table}</div>`);
}

function delete_album(album_id) {
    bootbox.confirm({
        title: "Album Deletion",
        message: "Do you want to delete this album? This cannot be undone.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: "http://localhost:3001/albums/" + album_id,
                    type: 'DELETE',
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        $("#test").replaceWith(
                            `<div id="errorLoadAlbumList">Error, failed to load the Album list</div>`
                        );
                    },
                });
            }
        }
    });


}

function load_albums() {
    $.ajax({
        url: "http://localhost:3001/albums",
        success: function (data) {
            let all_albums = [];
            $.each(data, function (index, entry) {
                let album = [];
                album.push(index);
                album.push(entry.name);
                album.push(entry.type);
                let pictuer_arr = [];
                $.each(entry.pictures, function (pic_index, pic_entry) {
                    let pic_data = [];
                    pic_data.push(pic_entry.name);
                    pic_data.push(pic_entry.link);
                    pic_data.push(pic_entry.photographer);
                    pic_data.push(pic_entry.id);
                    pictuer_arr.push(pic_data);
                })
                album.push(pictuer_arr);
                all_albums.push(album);
            });
            print_albums_table(all_albums);

            // $("#test").html(JSON.stringify(data));  <td><div id = "player${i}"><button id= "${data[i].id}" class="btn btn-outline-secondary" onClick="load_video(id,${i})">play</button></div></td>
        },
        error: function () {
            $("#test").replaceWith(
                `<div id="errorLoadAlbumList">Error, failed to load the Album list</div>`
            );
        },
    });

}

function create_album(){
    window.open("http://localhost:3001/create-album","_self");
    $("form[name='album_form']").validate({
        // Specify validation rules
        rules: {
          id_field: {
            required: true
          }
        },
        // Specify validation error messages
        messages: {         
          
        }
      });

}

onLoad = function () {
    load_albums();
};

$("document").ready(onLoad);
