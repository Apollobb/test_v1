
var user_grid = "#user-table";
var user_pager = "#user-pager";

jQuery(function($) {

    // table
    jQuery(user_grid).jqGrid({
        //direction: "rtl",
        //data: 'json',
        //mtype: 'POST',
        url: '/users/user?type=load',
        datatype: "json",
        height: 'auto',
        colNames:['ID','用户名称','中文名称','密码','所属部门','用户级别','用户角色','是否离职','创建时间','最后登录时间',' '],
        colModel:[
            {name:'id',index:'id', width:70, sorttype:"int", editable: false},
            {name:'name',index:'name', width:150,editable: true,editoptions:{size:"20",maxlength:"30"}},
            {name:'cnname',index:'cnname',width:150,editable:true,editoptions:{size:"20",maxlength:"30"}},
            {name:'password',index:'password', width:110,editable: true,edittype:"password",editoptions:{size:"20",maxlength:"30"}},
            {name:'department',index:'department', width:110,editable: true,edittype:"select",editoptions:{value:getDepartment}},
            {name:'leader',index:'leader', width:110,editable: true,edittype:"select",editoptions:{value:"1:普通员工;0:部门负责人"}},
            {name:'role',index:'role', width:110,editable: true,edittype:"select",editoptions:{value:"1:普通账号;0:系统管理员"}},
            {name:'is_quit',index:'is_quit', width:110,editable: true,edittype:"select",editoptions:{value:"1:在职;0:已离职"}},
            {name:'ctime',index:'ctime', width:110,editable: false},
            {name:'last_login',index:'last_login', width:110,editable: false},
            {name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
                formatter:'actions',
                formatoptions:{
                    keys:true,
                    delOptions:{recreateForm: true, beforeShowForm:beforeDeleteCallback},
                    //editformbutton:true,
                    editOptions:{recreateForm: true,beforeShowForm:beforeEditCallback}
                }
            }
        ],

        viewrecords : true,
        rowNum:10,
        rowList:[10,20,30],
        pager : user_pager,
        altRows: true,
        //toppager: true,

        multiselect: true,
        //multikey: "ctrlKey",
        multiboxonly: true,

        loadComplete : function() {
            var table = this;
            setTimeout(function(){
                styleCheckbox(table);
                updateActionIcons(table);
                updatePagerIcons(table);
                enableTooltips(table);
            }, 0);
        },

        editurl: '/users/user/',//nothing is saved 注意结尾/ , APPEND_SLASH
        caption: "用户管理",
        autowidth: true,

        jsonReader: {
            root: "data",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false,
        },
    });

    //navButtons
    jQuery(user_grid).jqGrid('navGrid',user_pager,
        { 	//navbar options
            edit: true,
            editicon : 'icon-pencil blue',
            add: true,
            addicon : 'icon-plus-sign purple',
            del: true,
            delicon : 'icon-trash red',
            search: false,
            searchicon : 'icon-search orange',
            refresh: true,
            refreshicon : 'icon-refresh green',
            view: true,
            viewicon : 'icon-zoom-in grey',
        },
        {
            //edit record form
            //closeAfterEdit: true,
            recreateForm: true,
            beforeShowForm : function(e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_edit_form(form);
            },
            afterSubmit : function(response, postdata) {
                //alert(response.responseText);
                var result = eval("(" + response.responseText + ")")

                if(result.status == 1 ){
                    return [false,result.message,''];
                }else {
                    return [true,result.message,''] ;
                }
            }
        },
        {
            //new record form
            closeAfterAdd: true,
            recreateForm: true,
            viewPagerButtons: false,
            beforeShowForm : function(e) {
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_edit_form(form);
            },
            afterSubmit : function(response, postdata) {
                //alert(response.responseText);
                var result = eval("(" + response.responseText + ")")

                if(result.status == 1 ){
                    return [false,result.message,''];
                }else {
                    return [true,result.message,''] ;
                }
            }
        },
        {
            //delete record form
            recreateForm: true,
            beforeShowForm : function(e) {
                var form = $(e[0]);
                if(form.data('styled')) return false;

                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                style_delete_form(form);

                form.data('styled', true);
            },
            onClick : function(e) {
                alert(1);
            },
            afterSubmit : function(response, postdata) {
                //alert(response.responseText);
                var result = eval("(" + response.responseText + ")")

                if(result.status == 1 ){
                    return [false,result.message,''];
                }else {
                    return [true,result.message,''] ;
                }
            }
        },
        {
            //search form
            recreateForm: true,
            afterShowSearch: function(e){
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                style_search_form(form);
            },
            afterRedraw: function(){
                style_search_filters($(this));
            }
            ,
            multipleSearch: true,
            /**
            multipleGroup:true,
            showQuery: true
            */
        },
        {
            //view record form
            recreateForm: true,
            beforeShowForm: function(e){
                var form = $(e[0]);
                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
            }
        }
    )

    //enable search/filter toolbar
    //jQuery(user_grid).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})

    //switch element when editing inline
    function aceSwitch( cellvalue, options, cell ) {
        setTimeout(function(){
            $(cell) .find('input[type=checkbox]')
                    .wrap('<label class="inline" />')
                .addClass('ace ace-switch ace-switch-5')
                .after('<span class="lbl"></span>');
        }, 0);
    }

    function style_edit_form(form) {
        //enable datepicker on "sdate" field and switches for "stock" field
        form.find('input[name=sdate]').datepicker({format:'yyyy-mm-dd' , autoclose:true})
            .end().find('input[name=stock]')
                  .addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

        //update buttons classes
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
        buttons.eq(0).addClass('btn-primary').prepend('<i class="icon-ok"></i>');
        buttons.eq(1).prepend('<i class="icon-remove"></i>')

        buttons = form.next().find('.navButton a');
        buttons.find('.ui-icon').remove();
        buttons.eq(0).append('<i class="icon-chevron-left"></i>');
        buttons.eq(1).append('<i class="icon-chevron-right"></i>');
    }

    function style_delete_form(form) {
        var buttons = form.next().find('.EditButton .fm-button');
        buttons.addClass('btn btn-sm').find('[class*="-icon"]').remove();//ui-icon, s-icon
        buttons.eq(0).addClass('btn-danger').prepend('<i class="icon-trash"></i>');
        buttons.eq(1).prepend('<i class="icon-remove"></i>')
    }

    function style_search_filters(form) {
        form.find('.delete-rule').val('X');
        form.find('.add-rule').addClass('btn btn-xs btn-primary');
        form.find('.add-group').addClass('btn btn-xs btn-success');
        form.find('.delete-group').addClass('btn btn-xs btn-danger');
    }

    function style_search_form(form) {
        var dialog = form.closest('.ui-jqdialog');
        var buttons = dialog.find('.EditTable')
        buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'icon-retweet');
        buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'icon-comment-alt');
        buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'icon-search');
    }

    function beforeDeleteCallback(e) {
        var form = $(e[0]);
        if(form.data('styled')) return false;

        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
        style_delete_form(form);

        form.data('styled', true);
    }

    function beforeEditCallback(e) {
        var form = $(e[0]);
        form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
        style_edit_form(form);
    }

    //it causes some flicker when reloading or navigating grid
    //it may be possible to have some custom formatter to do this as the grid is being created to prevent this
    //or go back to default browser checkbox styles for the grid
    function styleCheckbox(table) {
        /**
        $(table).find('input:checkbox').addClass('ace')
        .wrap('<label />')
        .after('<span class="lbl align-top" />')


        $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
        .find('input.cbox[type=checkbox]').addClass('ace')
        .wrap('<label />').after('<span class="lbl align-top" />');
        */
    }

    //unlike navButtons icons, action icons in rows seem to be hard-coded
    //you can change them like this in here if you want
    function updateActionIcons(table) {
        /**
        var replacement =
        {
            'ui-icon-pencil' : 'icon-pencil blue',
            'ui-icon-trash' : 'icon-trash red',
            'ui-icon-disk' : 'icon-ok green',
            'ui-icon-cancel' : 'icon-remove red'
        };
        $(table).find('.ui-pg-div span.ui-icon').each(function(){
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
            if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
        })
        */
    }

    //replace icons with FontAwesome icons like above
    function updatePagerIcons(table) {
        var replacement =
        {
            'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
            'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
            'ui-icon-seek-next' : 'icon-angle-right bigger-140',
            'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
        };
        $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
            var icon = $(this);
            var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

            if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
        })
    }

    function enableTooltips(table) {
        $('.navtable .ui-pg-button').tooltip({container:'body'});
        $(table).find('.ui-pg-div').tooltip({container:'body'});
    }

});

//
function getDepartment(){
    var department_str = ""
    $.ajax({
        url: '/users/department/',
        type: "POST",
        dataType: "json",
        async:false,  //设置为同步，等这个ajax有了返回值后才会执行下面的js
        data:{'oper':"getDepartment"},
        error: function () {
            alert("getDepartment error");
        },
        success: function (data) {
            //alert(data['message']);
            department_str =  data['message']
        }
    });
    return department_str
}

// search
var timeoutHnd;
var flAuto = false;
function doSearch(ev) {
    if(!flAuto){
      return;
    };

    if(timeoutHnd){
        clearTimeout(timeoutHnd);
    }

    timeoutHnd = setTimeout(gridReload, 1000);
}

function gridReload(){
    var search_enname = jQuery("#search_enname").val()||"";
    var search_cnname = jQuery("#search_cnname").val()||"";
    jQuery(user_grid).jqGrid('setGridParam', {
        url : "/users/user/?type=search&search_enname=" + search_enname+"&search_cnname="+search_cnname,
        page : 1
    }).trigger("reloadGrid");
}

function enableAutosubmit(state) {
    flAuto = state;
    jQuery("#searchButton").attr("disabled", state);
}
