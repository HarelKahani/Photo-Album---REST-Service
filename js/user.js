
function print_albums_table(data) {
    let table = `
            <table class="table table-dark" style="width:85%">
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
                     <td scope="row" class="row_size_num">${i + 1}</th>
                     <td scope="row" class="row_size">${data[i][1]}</th>
                     <td scope="row" class="row_size">${data[i][2]}</td>  
                     <td class="row_size_link">
                     <div class="main_group">
                        <div class="group">
                            <button type="button" class="btn btn-outline-secondary"  data-toggle="modal" data-target="#largeModal" onclick="view_pictuers(${data[i][0]})">View pictures</button>
                            <button type="button" class="btn btn-outline-secondary"  data-toggle="modal" data-target=".pic" onclick="add_picture(${data[i][0]})">Add picture</button>
                            <button type="button" class="btn btn-outline-secondary"  onclick="delete_album(${data[i][0]})">Delete Album</button>
                        </div>
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
        },
        error: function () {
            $("#test").replaceWith(
                `<div id="errorLoadAlbumList">Error, failed to load the Album list</div>`
            );
        },
    });

}

function load_html_page() {
    $("#create_album_form").load('http://localhost:3001/create-album');
    $("#add_pic_form").load('http://localhost:3001/add-picture');

}

function view_pictuers(album_id) {
    $.ajax({
        url: "http://localhost:3001/albums/" + album_id,
        success: function (data) {
            let pic_list = [];
            $.each(data["pictures"], function (pic_index, pic_entry) {
                let pic_data = [];
                pic_data.push(pic_entry.name);
                pic_data.push(pic_entry.link);
                pic_data.push(pic_entry.photographer);
                pic_data.push(pic_entry.id);
                pic_list.push(pic_data);
            });
            create_carousel(pic_list,data.name);
        },
        error: function () {
            $("#test").replaceWith(
                `<div id="errorLoadAlbumList">Error, failed to load the Album list</div>`
            );
        },
    });
}

function create_carousel(pic_list,album_name) {
    $(".modal-title").html(`${album_name}`);
    let carusel = `
    <div id="caru">
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol> 
      <div class="carousel-inner">`;
      if(pic_list.length!=0){
       carusel += `<div class="carousel-item active">
          <img class="d-block w-100" src="${pic_list[0][1]}" alt="First slide">     
            <div class="carousel-caption d-none d-md-block">
              <div class="text_bg">
                <h5>${pic_list[0][0]}</h5>
                <p>${pic_list[0][2]}</p>
              </div>
            </div>      
        </div>`;
    }
    for (i = 1; i < pic_list.length; i++) {
        carusel += ` <div class="carousel-item">
        <img class="d-block w-100" src="${pic_list[i][1]}" alt="Second slide">
            <div class="carousel-caption d-none d-md-block">
                <div class="text_bg">
                    <h5>${pic_list[i][0]}</h5>
                    <p>${pic_list[i][2]}</p>
                </div>
            </div>
    </div>`
    }
    carusel += `        </div>
                    </div >
                </div > `  

    $("#pic_carusel").replaceWith(`<div id="pic_carusel">${carusel}</div>`);


    


}

function add_picture(album_id) {
    $("form[name='pic_form']").validate({
        rules: {
            photographer_name: {
                required: true,
            },
            picture_name: {
                required: true,
            },
            url_field: {
                required: true,
            }
        },
        messages: {},
    });
    $("#pic_form").submit(function (event) {
        if (!$("#pic_form").valid()) return;
        $.ajax({
            type: "POST", // define the type of HTTP verb we want to use (POST for our form)
            url: "http://localhost:3001/albums/" + album_id, // the url where we want to POST
            contentType: "application/json",
            data: JSON.stringify({
                name: $("#picture_name").val(),
                photographer: $("#photographer_name").val(),
                link: $("#url_field").val(),
                id: "",
            }),
            processData: false,
            encode: true,
            success: function (data, textStatus, jQxhr) {

                location.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                $("#add_pic_form").replaceWith(
                    `< div id = "add_pic_form" > Error, failed to load the Album list</div > `
                );
            },
        });
        event.preventDefault();
    });

}

function create_album() {
    $("form[name='album_form']").validate({
        // Specify validation rules
        rules: {
            album_name: {
                required: true
            },
            type_field:{
                required: true
            }
        },
        // Specify validation error messages
        messages: {}
    });

    $("#album_form").submit(function (event) {
        if (!$("#album_form").valid()) return;
        $.ajax({
            type: "POST", // define the type of HTTP verb we want to use (POST for our form)
            url: "http://localhost:3001/albums", // the url where we want to POST
            contentType: "application/json",
            data: JSON.stringify({
                name: $("#album_name").val(),
                type: $("#type_field").val(),
                pictures: {},
            }),
            processData: false,
            encode: true,
            success: function (data, textStatus, jQxhr) {
                location.reload();
            },
            error: function (jqXhr, textStatus, errorThrown) {
                $("#add_pic_form").replaceWith(
                    `< div id = "add_pic_form" > Error, failed to load the Album list</div > `
                );
            },
        });
        event.preventDefault();
    });

}

onLoad = function () {
    load_html_page();
    load_albums();
};

$("document").ready(onLoad);
