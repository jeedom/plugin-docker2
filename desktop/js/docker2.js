
/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

function printEqLogic(_eqLogic) {
  if (_eqLogic.configuration && _eqLogic.configuration.url_access) {
    $('#link_dockerUrl').attr('href', _eqLogic.configuration.url_access.replace('#INTERNAL#', docker2_internal_ip).replace('#internal#', docker2_internal_ip))
    $('#link_dockerUrl').text(_eqLogic.configuration.url_access.replace('#INTERNAL#', docker2_internal_ip).replace('#internal#', docker2_internal_ip))
  }
}

$('#bt_editConfigFile').off('click').on('click', function() {
  jeedomUtils.loadPage('index.php?v=d&p=editor&root=plugins/docker2/data/config')
})

$('#bt_dockerLog').off('click').on('click', function() {
  $('#md_modal').dialog({ title: "{{Logs}}" }).load('index.php?v=d&plugin=docker2&modal=logs.docker&id=' + $('.eqLogicAttr[data-l1key=id]').value()).dialog('open')
})

$('#bt_dockerDownloadBackup').on('click', function() {
  window.open('core/php/downloadFile.php?pathfile=/var/www/html/plugins/docker2/data/backup/' + $('.eqLogicAttr[data-l1key=id]').value() + '.tar.gz', "_blank", null)
})

$('#bt_docker2Assistant').off('click').on('click', function() {
  $.ajax({
    type: "POST",
    url: "plugins/docker2/core/ajax/docker2.ajax.php",
    data: {
      action: "getTemplate",
    },
    dataType: 'json',
    error: function(error) {
      $.fn.showAlert({ message: error.message, level: 'danger' })
    },
    success: function(data) {
      if (data.state != 'ok') {
        $.fn.showAlert({ message: data.result, level: 'danger' })
        return
      }
      var options = []
      for (var i in data.result) {
        options.push({ text: i, value: i })
      }
      bootbox.prompt({
        title: "{{Nom du template ?}}",
        inputType: 'select',
        inputOptions: options,
        callback: function(result) {
          if (result == null) {
            return
          }
          $('#md_modal').dialog({ title: "{{Assistants}}" }).load('index.php?v=d&plugin=docker2&modal=assistant.docker&template=' + result + '&id=' + $('.eqLogicAttr[data-l1key=id]').value()).dialog('open')
        }
      })
    }
  })
})

$('#bt_dockerUploadBackup').fileupload({
  dataType: 'json',
  replaceFileInput: false,
  done: function(e, data) {
    if (data.result.state != 'ok') {
      $.fn.showAlert({
        message: data.result.result,
        level: 'danger'
      })
      return
    }
    $.fn.showAlert({
      message: '{{Fichier(s) ajouté(s) avec succès}}',
      level: 'success'
    })
  }
})

$('#bt_dockerBackup').off('click').on('click', function() {
  $.ajax({
    type: "POST",
    url: "plugins/docker2/core/ajax/docker2.ajax.php",
    data: {
      action: "backup",
      id: $('.eqLogicAttr[data-l1key=id]').value()
    },
    dataType: 'json',
    error: function(error) {
      $.fn.showAlert({ message: error.message, level: 'danger' })
    },
    success: function(data) {
      if (data.state != 'ok') {
        $.fn.showAlert({ message: data.result, level: 'danger' })
        return
      }
      $.fn.showAlert({ message: '{{Opération réalisée avec succès}}', level: 'success' })
    }
  })
})

$('#bt_dockerRestore').off('click').on('click', function() {
  bootbox.confirm('{{Etes-vous sûr de vouloir restaurer la dernière sauvegarde de ce conteneur ?}}', function(result) {
    if (result) {
      $.ajax({
        type: "POST",
        url: "plugins/docker2/core/ajax/docker2.ajax.php",
        data: {
          action: "restore",
          id: $('.eqLogicAttr[data-l1key=id]').value()
        },
        dataType: 'json',
        error: function(error) {
          $.fn.showAlert({ message: error.message, level: 'danger' })
        },
        success: function(data) {
          if (data.state != 'ok') {
            $.fn.showAlert({ message: data.result, level: 'danger' })
            return
          }
          $.fn.showAlert({ message: '{{Opération réalisée avec succès}}', level: 'success' })
        }
      })
    }
  })
})

$('#bt_syncDocker').off('click').on('click', function() {
  $.ajax({
    type: "POST",
    url: "plugins/docker2/core/ajax/docker2.ajax.php",
    data: {
      action: "sync",
    },
    dataType: 'json',
    error: function(error) {
      $.fn.showAlert({ message: error.message, level: 'danger' })
    },
    success: function(data) {
      if (data.state != 'ok') {
        $.fn.showAlert({ message: data.result, level: 'danger' })
        return
      }
      $.fn.showAlert({ message: '{{Opération réalisée avec succès}}', level: 'success' })
      window.location.reload()
    }
  })
})

$('.eqLogicAttr[data-l1key=configuration][data-l2key="create::mode"]').off('change').on('change', function() {
  $('.create_mode').hide()
  $('.create_mode.' + $(this).value()).show()
})

$("#table_cmd").sortable({
  axis: "y",
  cursor: "move",
  items: ".cmd",
  placeholder: "ui-state-highlight",
  tolerance: "intersect",
  forcePlaceholderSize: true
})

function addCmdToTable(_cmd) {
  if (!isset(_cmd)) {
    var _cmd = { configuration: {} }
  }
  if (!isset(_cmd.configuration)) {
    _cmd.configuration = {}
  }
  var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">'
  tr += '<td class="hidden-xs">'
  tr += '<span class="cmdAttr" data-l1key="id"></span>'
  tr += '</td>'
  tr += '<td>'
  tr += '<div class="input-group">'
  tr += '<input class="cmdAttr form-control input-sm roundedLeft" data-l1key="name" placeholder="{{Nom de la commande}}">'
  tr += '<span class="input-group-btn">'
  tr += '<a class="cmdAction btn btn-sm btn-default" data-l1key="chooseIcon" title="{{Choisir une icône}}"><i class="fas fa-icons"></i></a>'
  tr += '</span>'
  tr += '<span class="cmdAttr input-group-addon roundedRight" data-l1key="display" data-l2key="icon" style="font-size:19px;padding:0 5px 0 0!important;"></span>'
  tr += '</div>'
  tr += '<select class="cmdAttr form-control input-sm" data-l1key="value" style="display:none;margin-top:5px;" title="{{Commande information liée}}">'
  tr += '<option value="">{{Aucune}}</option>'
  tr += '</select>'
  tr += '</td>'
  tr += '<td>'
  tr += '<span class="type" type="' + init(_cmd.type) + '">' + jeedom.cmd.availableType() + '</span>'
  tr += '<span class="subType" subType="' + init(_cmd.subType) + '"></span>'
  tr += '</td>'
  tr += '<td>'
  tr += '<span class="cmdAttr" data-l1key="htmlstate"></span>'
  tr += '</td>'
  tr += '<td>'
  tr += '<label class="checkbox-inline"><input type="checkbox" class="cmdAttr" data-l1key="isVisible" checked>{{Afficher}}</label> '
  tr += '<label class="checkbox-inline"><input type="checkbox" class="cmdAttr" data-l1key="isHistorized" checked>{{Historiser}}</label> '
  tr += '<label class="checkbox-inline"><input type="checkbox" class="cmdAttr" data-l1key="display" data-l2key="invertBinary">{{Inverser}}</label> '
  tr += '<div style="margin-top:7px;">'
  tr += '<input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="minValue" placeholder="{{Min}}" title="{{Min}}" style="width:30%;max-width:80px;display:inline-block;margin-right:2px;">'
  tr += '<input class="tooltips cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="maxValue" placeholder="{{Max}}" title="{{Max}}" style="width:30%;max-width:80px;display:inline-block;margin-right:2px;">'
  tr += '<input class="tooltips cmdAttr form-control input-sm" data-l1key="unite" placeholder="Unité" title="{{Unité}}" style="width:30%;max-width:80px;display:inline-block;margin-right:2px;">'
  tr += '</div>'
  tr += '</td>'
  tr += '<td>'
  if (is_numeric(_cmd.id)) {
    tr += '<a class="btn btn-default btn-xs cmdAction" data-action="configure"><i class="fas fa-cogs"></i></a> '
    tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fas fa-rss"></i> {{Tester}}</a>'
  }
  tr += ' <i class="fas fa-minus-circle pull-right cmdAction cursor" data-action="remove"></i></td>'
  tr += '</tr>'
  $('#table_cmd tbody').append(tr)
  var tr = $('#table_cmd tbody tr').last()
  jeedom.eqLogic.buildSelectCmd({
    id: $('.eqLogicAttr[data-l1key=id]').value(),
    filter: { type: 'info' },
    error: function(error) {
      $.fn.showAlert({ message: error.message, level: 'danger' })
    },
    success: function(result) {
      tr.find('.cmdAttr[data-l1key=value]').append(result)
      tr.setValues(_cmd, '.cmdAttr')
      jeedom.cmd.changeType(tr, init(_cmd.subType))
    }
  })
}
