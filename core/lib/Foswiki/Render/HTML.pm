# See bottom of file for license and copyright information
package Foswiki::Render::HTML;

use strict;
use warnings;

use Foswiki       ();
use Foswiki::Meta ();

BEGIN {
    if ( $Foswiki::cfg{UseLocale} ) {
        require locale;
        import locale();
    }
}

=begin TML

---++ StaticMethod textarea( $params) -> $text

Render parent meta-data. Support for %META%.

=cut

sub textarea {
    my %ah = @_;

    my $class = $ah{'-class'} || '';
    my $cols  = $ah{'-cols'}  || 20;
    my $text  = $ah{'-default'};
    my $id    = $ah{'-id'}    || '';
    my $name  = $ah{'-name'}  || '';
    my $rows  = $ah{'-rows'}  || 4;
    my $style = $ah{'-style'} || '';

    my $disabled = ( $ah{'-disabled'} ) ? 'disabled' : '';
    my $readonly = ( $ah{'-readonly'} ) ? 'readonly' : '';

    #load the templates (relying on the system-wide skin path.)
    my $session = $Foswiki::Plugins::SESSION;
    $session->templates->readTemplate('html');
    my $tmpl = $session->templates->expandTemplate('textarea');

    $tmpl =~ s/%CLASS%/$class/;
    $tmpl =~ s/%COLS%/$cols/;
    $tmpl =~ s/%DISABLED%/$disabled/;
    $tmpl =~ s/%ID%/$id/;
    $tmpl =~ s/%NAME%/$name/;
    $tmpl =~ s/%READONLY%/$readonly/;
    $tmpl =~ s/%ROWS%/$rows/;
    $tmpl =~ s/%STYLE%/$style/;

    $text = Foswiki::entityEncode($text);
    $tmpl =~ s/%TEXT%/$text/g;
    return $tmpl;
}

sub textfield {
    my %ah = @_;

    my $class = $ah{'-class'} || '';
    my $id    = $ah{'-id'}    || '';
    my $name  = $ah{'-name'}  || '';
    my $size  = $ah{'-size'}  || 20;
    my $style = $ah{'-style'} || '';
    my $value = $ah{'-value'} || '';

    my $disabled = ( $ah{'-disabled'} ) ? 'disabled' : '';
    my $readonly = ( $ah{'-readonly'} ) ? 'readonly' : '';

    #load the templates (relying on the system-wide skin path.)
    my $session = $Foswiki::Plugins::SESSION;
    $session->templates->readTemplate('html');
    my $tmpl = $session->templates->expandTemplate('textfield');

    $tmpl =~ s/%CLASS%/$class/;
    $tmpl =~ s/%DISABLED%/$disabled/;
    $tmpl =~ s/%ID%/$id/;
    $tmpl =~ s/%NAME%/$name/;
    $tmpl =~ s/%READONLY%/$readonly/;
    $tmpl =~ s/%SIZE%/$size/;
    $tmpl =~ s/%STYLE%/$style/;
    $tmpl =~ s/%VALUE%/$value/;

    return $tmpl;
}

1;
__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Copyright (C) 2008-2015 Foswiki Contributors. Foswiki Contributors
are listed in the AUTHORS file in the root of this distribution.
NOTE: Please extend that file, not this notice.

Additional copyrights apply to some or all of the code in this
file as follows:

Copyright (C) 2001-2007 Peter Thoeny, peter@thoeny.org
and TWiki Contributors. All Rights Reserved.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.