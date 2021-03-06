<% months.forEach( function( month ) { %>
    <div class="modui-month" data-month="<%= month.index %>" data-year="<%= month.year %>">
        <nav>
            <% if(month.isFirst) { %>
                <a class="nav-btn next-btn <% if(isNextBtnDisabled) { %> disabled <% } %>" data-nav="next">
                    &#9658;
                </a>
                <a class="nav-btn prev-btn <% if(isPrevBtnDisabled) { %> disabled <% } %>" data-nav="prev">
                    &#9668;
                </a>
            <% } %>
            <h6>
                <% if( displayYearBeforeMonth ) { %>
                    <%= month.year %> <%= month.label %>
                <% } else { %>
                    <%= month.label %> <%= month.year %>
                <% } %>
            </h6>
        </nav>
        <table>
            <% if( month.isFirst ) { %>
                <thead>
                    <tr>
                        <% dayLabels.forEach( function( dayLabel ) { %>
                            <th>
                                <span>
                                    <%= dayLabel %>
                                </span>
                            </th>
                        <% }) %>
                    </tr>
                </thead>
            <% } %>
            <tbody>
                <% month.weeks.forEach( function( week ) { %>
                    <tr>
                        <% week.forEach( function( day ) { %>
                            <% if(day.number) { %>
                                <td class="day <%= day.classes %>" data-date="<%= month.year + '-' + month.index + '-' + day.number %>">
                                    <a>
                                        <%= day.number %>
                                    </a>
                                </td>
                            <% } else { %>
                                <td class="blank">
                                    <a></a>
                                </td>
                            <% } %>
                        <% } ) %>
                    </tr>
                <% } ) %>
            </tbody>
        </table>
    </div>
<% } ) %>
