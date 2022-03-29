var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Movies page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM mobil",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("moviesq/list", {
          title: "RT Motor",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var movies = {
        id: req.params.id,
      };

      var delete_sql = "delete from mobil where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          movies,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/bengkel");
            } else {
              req.flash("msg_info", "Delete Movies Success");
              res.redirect("/bengkel");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM mobil where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/bengkel");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Mobil tidak ditemukan!");
              res.redirect("/bengkel");
            } else {
              console.log(rows);
              res.render("moviesq/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Please fill the name").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama            = req.sanitize("nama").escape().trim();
      v_no_telp         = req.sanitize("no_telp").escape().trim();
      v_jenis_mobil     = req.sanitize("jenis_mobil").escape().trim();
      v_nopol           = req.sanitize("nopol").escape();
      v_tanggal_masuk   = req.sanitize("tanggal_masuk").escape().trim();
      v_tanggal_keluar  = req.sanitize("tanggal_keluar").escape().trim();
      v_rincian         = req.sanitize("rincian").escape().trim();
      v_biaya_sparepart = req.sanitize("biaya_sparepart").escape().trim();
      v_biaya_jasa      = req.sanitize("biaya_jasa").escape().trim();
      v_total           = req.sanitize("total").escape().trim();

      var movies = {
        nama: v_nama,
        no_telp: v_no_telp,
        jenis_mobil: v_jenis_mobil,
        nopol: v_nopol,
        tanggal_masuk: v_tanggal_masuk,
        tanggal_keluar: v_tanggal_keluar,
        rincian: v_rincian,
        biaya_sparepart: v_biaya_sparepart,
        biaya_jasa: v_biaya_jasa,
        total: v_total,
      };

      var update_sql = "update mobil SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          movies,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("moviesq/edit", {
                nama: req.param("nama"),
                no_telp: req.param("no_telp"),
                jenis_mobil: req.param("jenis_mobil"),
                nopol: req.param("nopol"),
                tanggal_masuk: req.param("tanggal_masuk"),
                tanggal_keluar: req.param("tanggal_keluar"),
                rincian: req.param("rincian"),
                biaya_sparepart: req.param("biaya_sparepart"),
                biaya_jasa: req.param("biaya_jasa"),
                total: req.param("total"),
              });
            } else {
              req.flash("msg_info", "Update mobil berhasil");
              res.redirect("/bengkel/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/bengkel/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama            = req.sanitize("nama").escape().trim();
    v_no_telp         = req.sanitize("no_telp").escape().trim();
    v_jenis_mobil     = req.sanitize("jenis_mobil").escape().trim();
    v_nopol           = req.sanitize("nopol").escape();
    v_tanggal_masuk   = req.sanitize("tanggal_masuk").escape().trim();
    v_tanggal_keluar  = req.sanitize("tanggal_keluar").escape().trim();
    v_rincian         = req.sanitize("rincian").escape().trim();
    v_biaya_sparepart = req.sanitize("biaya_sparepart").escape().trim();
    v_biaya_jasa      = req.sanitize("biaya_jasa").escape().trim();
    v_total           = req.sanitize("total").escape().trim();

    var movies = {
      nama: v_nama,
      no_telp: v_no_telp,
      jenis_mobil: v_jenis_mobil,
      nopol: v_nopol,
      tanggal_masuk: v_tanggal_masuk,
      tanggal_keluar: v_tanggal_keluar,
      rincian: v_rincian,
      biaya_sparepart: v_biaya_sparepart,
      biaya_jasa: v_biaya_jasa,
      total: v_total,
    };

    var insert_sql = "INSERT INTO mobil SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        movies,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("moviesq/add-movies", {
              nama: req.param("nama"),
              no_telp: req.param("no_telp"),
              jenis_mobil: req.param("jenis_mobil"),
              nopol: req.param("nopol"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Data mobil berhasil dibuat!");
            res.redirect("/bengkel");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("moviesq/add-movies", {
      nama: req.param("nama"),
      no_telp: req.param("no_telp"),
      jenis_mobil: req.param("jenis_mobil"),
      nopol: req.param("nopol"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("moviesq/add-movies", {
    title: "Tambah Mobil",
    nama: "",
    no_telp: "",
    jenis_mobil: "",
    nopol: "",
    tanggal_masuk: "",
    tanggal_keluar: "",
    rincian: "",
    biaya_sparepart: "",
    biaya_jasa: "",
    total: "",
    session_store: req.session,
  });
});

module.exports = router;
