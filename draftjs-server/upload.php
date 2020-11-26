<?php

if(!empty($_FILES)) {

    $filename = uniqid() . '-' . $_FILES['file']['name'];
    $filepath = __DIR__ . '/uploads/' . $filename;
    move_uploaded_file($_FILES['file']['tmp_name'], $filepath);

    $file_url = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . '/uploads/' . $filename;
    echo $file_url;
}